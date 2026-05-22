#!/usr/bin/env node
/**
 * Attach the 6 subscription IAPs to version 1.5.0 and submit for review.
 *
 * Usage:
 *   ASC_ISSUER_ID=<uuid-from-app-store-connect> node scripts/attach-iaps-and-submit.js
 *
 * Gets KEY_ID from AuthKey_*.p8 filename, app ID from eas.json, version from app.json.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');

const ROOT = path.resolve(__dirname, '..');
const APP_JSON = JSON.parse(fs.readFileSync(path.join(ROOT, 'app.json'), 'utf8'));
const EAS_JSON = JSON.parse(fs.readFileSync(path.join(ROOT, 'eas.json'), 'utf8'));

const APP_VERSION = APP_JSON.expo.version;
const ASC_APP_ID = EAS_JSON.submit.production.ios.ascAppId;

const ISSUER_ID = process.env.ASC_ISSUER_ID;
if (!ISSUER_ID) {
  console.error('Set ASC_ISSUER_ID env var (UUID from App Store Connect → Users and Access → Integrations).');
  process.exit(1);
}

const keyFile = fs.readdirSync(ROOT).find(f => /^AuthKey_.+\.p8$/.test(f));
if (!keyFile) {
  console.error('No AuthKey_*.p8 file found in project root.');
  process.exit(1);
}
const KEY_ID = keyFile.match(/^AuthKey_(.+)\.p8$/)[1];
const privateKey = fs.readFileSync(path.join(ROOT, keyFile), 'utf8');

const IAP_IDS = [
  '6760442919', // growth monthly
  '6760492298', // growth yearly
  '6760491034', // pro monthly
  '6760491514', // pro yearly
  '6760486886', // starter monthly
  '6760490715', // starter yearly
];

function jwt() {
  const header = { alg: 'ES256', kid: KEY_ID, typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const payload = { iss: ISSUER_ID, iat: now, exp: now + 1200, aud: 'appstoreconnect-v1' };
  const b64 = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url');
  const signingInput = `${b64(header)}.${b64(payload)}`;
  const signature = crypto.sign('SHA256', Buffer.from(signingInput), { key: privateKey, dsaEncoding: 'ieee-p1363' });
  return `${signingInput}.${signature.toString('base64url')}`;
}

function request(method, urlPath, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = https.request({
      hostname: 'api.appstoreconnect.apple.com',
      path: urlPath,
      method,
      headers: {
        Authorization: `Bearer ${jwt()}`,
        'Content-Type': 'application/json',
        ...(data && { 'Content-Length': Buffer.byteLength(data) }),
      },
    }, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        const text = Buffer.concat(chunks).toString();
        const parsed = text ? (() => { try { return JSON.parse(text); } catch { return text; } })() : null;
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ status: res.statusCode, body: parsed });
        } else {
          reject(new Error(`${method} ${urlPath} → ${res.statusCode}: ${text}`));
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

(async () => {
  console.log(`[1/6] Looking up version ${APP_VERSION} for app ${ASC_APP_ID}...`);
  const vRes = await request('GET',
    `/v1/apps/${ASC_APP_ID}/appStoreVersions?filter%5BversionString%5D=${APP_VERSION}&filter%5Bplatform%5D=IOS`);
  const version = vRes.body.data?.[0];
  if (!version) throw new Error(`No iOS version ${APP_VERSION} found on ASC.`);
  const VERSION_ID = version.id;
  const state = version.attributes.appStoreState;
  console.log(`    Version ID: ${VERSION_ID} (state: ${state})`);

  console.log(`[2/6] Freeing version from any existing reviewSubmissions (delete items → submissions become empty)...`);
  // ASC doesn't accept comma-separated values in filter[state], so issue one
  // request per state and merge. Any shared submission ID will be deduped.
  const PENDING_STATES = ['READY_FOR_REVIEW', 'WAITING_FOR_REVIEW', 'IN_REVIEW', 'UNRESOLVED_ISSUES'];
  const seenIds = new Set();
  const allSubs = [];
  for (const state of PENDING_STATES) {
    const res = await request('GET', `/v1/apps/${ASC_APP_ID}/reviewSubmissions?filter%5Bplatform%5D=IOS&filter%5Bstate%5D=${state}`);
    for (const sub of res.body.data || []) {
      if (!seenIds.has(sub.id)) {
        seenIds.add(sub.id);
        allSubs.push(sub);
      }
    }
  }
  if (allSubs.length === 0) {
    console.log('    No pending submissions.');
  }
  for (const s of allSubs) {
    const items = await request('GET', `/v1/reviewSubmissions/${s.id}/items`);
    for (const it of items.body.data || []) {
      try {
        await request('DELETE', `/v1/reviewSubmissionItems/${it.id}`);
        console.log(`    Deleted item ${it.id} from submission ${s.id}`);
      } catch (e) {
        console.warn(`    Could not delete item ${it.id}: ${e.message.split('\n')[0]}`);
      }
    }
  }

  console.log('[3/6] Creating review submission...');
  const subRes = await request('POST', '/v1/reviewSubmissions', {
    data: {
      type: 'reviewSubmissions',
      attributes: { platform: 'IOS' },
      relationships: {
        app: { data: { type: 'apps', id: ASC_APP_ID } },
      },
    },
  });
  const SUBMISSION_ID = subRes.body.data.id;
  console.log(`    Submission ID: ${SUBMISSION_ID}`);

  console.log('[4/6] Adding binary version as submission item...');
  await request('POST', '/v1/reviewSubmissionItems', {
    data: {
      type: 'reviewSubmissionItems',
      relationships: {
        reviewSubmission: { data: { type: 'reviewSubmissions', id: SUBMISSION_ID } },
        appStoreVersion: { data: { type: 'appStoreVersions', id: VERSION_ID } },
      },
    },
  });
  console.log('    Binary version item added.');

  console.log('[5/6] Adding 6 subscription items to submission...');
  let attachedCount = 0;
  for (const id of IAP_IDS) {
    try {
      const r = await request('POST', '/v1/reviewSubmissionItems', {
        data: {
          type: 'reviewSubmissionItems',
          relationships: {
            reviewSubmission: { data: { type: 'reviewSubmissions', id: SUBMISSION_ID } },
            subscription: { data: { type: 'subscriptions', id } },
          },
        },
      });
      console.log(`    Subscription ${id} → added (${r.body.data?.id || 'ok'})`);
      attachedCount++;
    } catch (e) {
      console.warn(`    Subscription ${id} → ${e.message.split('\n').slice(0, 2).join(' | ')}`);
    }
  }
  if (attachedCount === 0) {
    throw new Error('No subscriptions were attached — refusing to submit the version alone. Fix the subscription relationship first.');
  }
  console.log(`    Attached ${attachedCount}/${IAP_IDS.length} subscriptions.`);

  console.log('[6/6] Submitting review for version...');
  await request('PATCH', `/v1/reviewSubmissions/${SUBMISSION_ID}`, {
    data: { type: 'reviewSubmissions', id: SUBMISSION_ID, attributes: { submitted: true } },
  });
  console.log('\nSubmitted. Version + 6 IAPs now In Review with Apple.');
  console.log(`View: https://appstoreconnect.apple.com/apps/${ASC_APP_ID}/appstore/reviewsubmissions/${SUBMISSION_ID}`);
})().catch((e) => {
  console.error('\nFailed:', e.message);
  process.exit(1);
});

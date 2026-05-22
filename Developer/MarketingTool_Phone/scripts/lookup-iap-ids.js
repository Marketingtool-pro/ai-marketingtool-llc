#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');

const ROOT = path.resolve(__dirname, '..');
const EAS_JSON = JSON.parse(fs.readFileSync(path.join(ROOT, 'eas.json'), 'utf8'));
const ASC_APP_ID = EAS_JSON.submit.production.ios.ascAppId;
const ISSUER_ID = process.env.ASC_ISSUER_ID;
if (!ISSUER_ID) {
  console.error('Error: ASC_ISSUER_ID environment variable is required.');
  console.error('Get it from https://appstoreconnect.apple.com/access/integrations/api');
  process.exit(1);
}
const keyFile = fs.readdirSync(ROOT).find(f => /^AuthKey_.+\.p8$/.test(f));
if (!keyFile) {
  console.error(`Error: No AuthKey_*.p8 file found in ${ROOT}.`);
  process.exit(1);
}
const keyMatch = keyFile.match(/^AuthKey_(.+)\.p8$/);
if (!keyMatch) {
  console.error(`Error: Could not extract KEY_ID from filename ${keyFile}.`);
  process.exit(1);
}
const KEY_ID = keyMatch[1];
const privateKey = fs.readFileSync(path.join(ROOT, keyFile), 'utf8');

function jwt() {
  const header = { alg: 'ES256', kid: KEY_ID, typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const payload = { iss: ISSUER_ID, iat: now, exp: now + 1200, aud: 'appstoreconnect-v1' };
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
  const s = `${b64(header)}.${b64(payload)}`;
  return `${s}.${crypto.sign('SHA256', Buffer.from(s), { key: privateKey, dsaEncoding: 'ieee-p1363' }).toString('base64url')}`;
}

function req(urlPath) {
  return new Promise((resolve, reject) => {
    https.request({ hostname: 'api.appstoreconnect.apple.com', path: urlPath, method: 'GET',
      headers: { Authorization: `Bearer ${jwt()}` }
    }, (res) => {
      const c = []; res.on('data', d => c.push(d));
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(Buffer.concat(c).toString()) }));
    }).on('error', reject).end();
  });
}

(async () => {
  console.log('=== Subscriptions (V2) ===');
  const groups = await req(`/v1/apps/${ASC_APP_ID}/subscriptionGroups?limit=200`);
  for (const g of groups.body.data || []) {
    console.log(`\nGroup: ${g.attributes.referenceName} (id: ${g.id})`);
    const subs = await req(`/v1/subscriptionGroups/${g.id}/subscriptions?limit=200`);
    for (const s of subs.body.data || []) {
      console.log(`  ${s.attributes.productId.padEnd(45)} → id: ${s.id}   state: ${s.attributes.state}`);
    }
  }
  console.log('\n=== Consumables / Non-Consumables (V2) ===');
  const iaps = await req(`/v1/apps/${ASC_APP_ID}/inAppPurchasesV2?limit=200`);
  for (const i of iaps.body.data || []) {
    console.log(`  ${i.attributes.productId.padEnd(45)} → id: ${i.id}   state: ${i.attributes.state}   type: ${i.attributes.inAppPurchaseType}`);
  }
})().catch(e => { console.error(e); process.exit(1); });

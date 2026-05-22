const https = require("https");

// All credentials read from Appwrite Function env vars (no inline secrets).
// Required env: BIRD_ACCESS_KEY, BIRD_WORKSPACE_ID, BIRD_CHANNEL_ID,
//               APPWRITE_API_KEY, APPWRITE_PROJECT_ID
// Optional env: REVIEW_TEST_PHONE (defaults +919999999999),
//               REVIEW_TEST_OTP (defaults 123456)

const BIRD_KEY = process.env.BIRD_ACCESS_KEY;
const BIRD_WS = process.env.BIRD_WORKSPACE_ID;
const BIRD_CH = process.env.BIRD_CHANNEL_ID;
const AW_KEY = process.env.APPWRITE_API_KEY;
const AW_PROJ = process.env.APPWRITE_PROJECT_ID;

// App Store / Play Store reviewer bypass — works for ANY country reviewer flow.
const REVIEW_TEST_PHONE = process.env.REVIEW_TEST_PHONE || "+919999999999";
const REVIEW_TEST_OTP = process.env.REVIEW_TEST_OTP || "123456";
const REVIEW_VERIFICATION_ID = "REVIEW_BYPASS_VID";

function httpReq(host, path, method, headers, body) {
  return new Promise((resolve, reject) => {
    var req = https.request({ hostname: host, path, method, headers, timeout: 15000 }, (res) => {
      var data = "";
      res.on("data", (c) => { data += c; });
      res.on("end", () => { try { resolve({ ok: res.statusCode >= 200 && res.statusCode < 300, status: res.statusCode, body: JSON.parse(data) }); } catch(e) { resolve({ ok: false, status: res.statusCode, body: data }); } });
    });
    req.on("error", reject);
    req.on("timeout", () => { req.destroy(); reject(new Error("timeout")); });
    if (body) req.write(body);
    req.end();
  });
}

module.exports = async ({ req, res, log, error }) => {
  var H = { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" };
  if (req.method === "OPTIONS") return res.json({ status: "ok" }, 200, H);

  // Fail fast if env vars not configured.
  if (!BIRD_KEY || !BIRD_WS || !BIRD_CH || !AW_KEY || !AW_PROJ) {
    error("[B] Missing required env vars (BIRD_ACCESS_KEY, BIRD_WORKSPACE_ID, BIRD_CHANNEL_ID, APPWRITE_API_KEY, APPWRITE_PROJECT_ID)");
    return res.json({ success: false, message: "Server misconfigured" }, 500, H);
  }

  try {
    var body;
    try { body = typeof req.body === "string" ? JSON.parse(req.body) : req.body; } catch(e) { body = {}; }
    var action = body.action || "";
    var phone = body.phone || body.identifier || "";
    var code = body.code || body.otp || "";
    var vid = body.verificationId || body.reqId || "";
    var birdH = { "Authorization": "AccessKey " + BIRD_KEY, "Content-Type": "application/json" };
    var awH = { "Content-Type": "application/json", "X-Appwrite-Project": AW_PROJ, "X-Appwrite-Key": AW_KEY };

    log("[B] " + action + " " + (phone ? phone.substring(0,5) + "***" : ""));

    if (action === "sendOtp" || action === "send") {
      var np = phone.startsWith("+") ? phone : "+" + phone.replace(/\D/g, "");
      if (np.length < 8) return res.json({ success: false, message: "Bad phone" }, 400, H);

      // REVIEWER BYPASS — App Store / Play Store demo. Skips Bird, no SMS sent.
      if (np === REVIEW_TEST_PHONE) {
        log("[B] reviewer bypass: skipping Bird, accepting fixed OTP");
        // Still register/find Appwrite user so verifyOtp can issue a session token.
        var tr = await httpReq("api.marketingtool.pro", "/v1/account/tokens/phone", "POST",
          { "Content-Type": "application/json", "X-Appwrite-Project": AW_PROJ },
          JSON.stringify({ userId: "unique()", phone: np }));
        var uid = tr.ok ? tr.body.userId : null;
        return res.json({ success: true, type: "success", message: "OTP sent", verificationId: REVIEW_VERIFICATION_ID, reqId: REVIEW_VERIFICATION_ID, userId: uid }, 200, H);
      }

      // Create Appwrite phone token (registers user)
      var tr = await httpReq("api.marketingtool.pro", "/v1/account/tokens/phone", "POST",
        { "Content-Type": "application/json", "X-Appwrite-Project": AW_PROJ },
        JSON.stringify({ userId: "unique()", phone: np }));
      var uid = tr.ok ? tr.body.userId : null;
      log("[B] aw token: " + (tr.ok ? uid : tr.status));

      // Send via Bird Verify (international support)
      var r = await httpReq("api.bird.com", "/workspaces/" + BIRD_WS + "/verify", "POST", birdH,
        JSON.stringify({ identifier: { phonenumber: np }, codeLength: 6, maxAttempts: 5, timeout: 300, steps: [{ channelId: BIRD_CH }] }));
      log("[B] bird: " + r.status);
      if (!r.ok) return res.json({ success: false, message: "Send failed" }, 500, H);
      return res.json({ success: true, type: "success", message: "OTP sent", verificationId: r.body.id, reqId: r.body.id, userId: uid }, 200, H);
    }

    if (action === "verifyOtp" || action === "verify") {
      if (!code || !vid) return res.json({ success: false, message: "Code required" }, 400, H);

      // REVIEWER BYPASS — accept fixed code for fixed verification ID.
      if (vid === REVIEW_VERIFICATION_ID) {
        if (String(code) !== REVIEW_TEST_OTP) {
          log("[B] reviewer bypass: wrong code submitted");
          return res.json({ success: false, message: "Invalid OTP" }, 400, H);
        }
        log("[B] reviewer bypass: accepted");
        var vp = REVIEW_TEST_PHONE;
        var uid = body.userId || null;
        if (!uid) {
          var sr = await httpReq("api.marketingtool.pro", "/v1/users?search=" + encodeURIComponent(vp), "GET", awH);
          if (sr.ok && sr.body.users && sr.body.users.length > 0) uid = sr.body.users[0]["$id"];
        }
        if (!uid) return res.json({ success: true, verified: true, message: "No user" }, 200, H);
        var tokR = await httpReq("api.marketingtool.pro", "/v1/users/" + uid + "/tokens", "POST", awH,
          JSON.stringify({ length: 64, expire: 31536000 }));
        if (!tokR.ok) return res.json({ success: true, verified: true, userId: uid, message: "Token failed: " + tokR.status }, 200, H);
        return res.json({ success: true, type: "success", verified: true, userId: uid, secret: tokR.body.secret }, 200, H);
      }

      var r = await httpReq("api.bird.com", "/workspaces/" + BIRD_WS + "/verify/" + vid, "POST", birdH,
        JSON.stringify({ code: String(code) }));
      log("[B] verify: " + r.status + " " + (r.body.status || "?"));
      if (!r.ok || r.body.status !== "verified") return res.json({ success: false, message: "Invalid OTP" }, 400, H);

      var vp = r.body.identifier ? r.body.identifier.phonenumber : phone;
      var uid = body.userId || null;

      // Find user if not provided
      if (!uid) {
        var sr = await httpReq("api.marketingtool.pro", "/v1/users?search=" + encodeURIComponent(vp), "GET", awH);
        if (sr.ok && sr.body.users && sr.body.users.length > 0) uid = sr.body.users[0]["$id"];
        log("[B] search: " + (uid || "none"));
      }
      if (!uid) return res.json({ success: true, verified: true, message: "No user" }, 200, H);

      // Create token via REST API (not SDK)
      var tokR = await httpReq("api.marketingtool.pro", "/v1/users/" + uid + "/tokens", "POST", awH,
        JSON.stringify({ length: 64, expire: 31536000 }));
      log("[B] token: " + tokR.status + " secret_len=" + (tokR.ok ? tokR.body.secret.length : 0));

      if (!tokR.ok) {
        log("[B] token err: " + JSON.stringify(tokR.body).substring(0,200));
        return res.json({ success: true, verified: true, userId: uid, message: "Token failed: " + tokR.status }, 200, H);
      }

      return res.json({ success: true, type: "success", verified: true, userId: uid, secret: tokR.body.secret }, 200, H);
    }

    if (action === "resendOtp" || action === "resend") {
      if (!vid) return res.json({ success: false, message: "ID required" }, 400, H);
      // Reviewer bypass — resend is a no-op (same fixed code stays valid).
      if (vid === REVIEW_VERIFICATION_ID) {
        return res.json({ success: true, verificationId: vid }, 200, H);
      }
      var r = await httpReq("api.bird.com", "/workspaces/" + BIRD_WS + "/verify/" + vid + "/resend", "POST", birdH);
      return res.json({ success: r.ok, verificationId: vid }, 200, H);
    }

    return res.json({ message: "Unknown action" }, 400, H);
  } catch (err) { error("[B] " + err.message); return res.json({ success: false, message: "Error" }, 500, H); }
};

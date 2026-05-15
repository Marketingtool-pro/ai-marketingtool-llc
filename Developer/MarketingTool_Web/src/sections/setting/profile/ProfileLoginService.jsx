import { useState, useEffect, useCallback } from "react";

// @mui
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CardMedia from "@mui/material/CardMedia";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

// @third-party
import { enqueueSnackbar } from "notistack";

// @project
import SettingCard from "@/components/cards/SettingCard";
import { useAuth } from "@/contexts/AuthContext";
import { fetchConnectedAccounts } from "@/utils/api/windmill";
import { AUTH_USER_KEY } from "@/config";
import { AvatarSize } from "@/enum";

// @assets
import { IconCheck } from "@tabler/icons-react";
import googleImg from "@/assets/images/social/google.svg";
import facebookImg from "@/assets/images/social/facebook.svg";
import instagramImg from "@/assets/images/social/instagram.svg";

// OAuth config
const FB_APP_ID = "1582682256320433";
const FB_SCOPES =
  "ads_read,ads_management,business_management,pages_read_engagement,pages_manage_ads,pages_show_list,pages_manage_metadata,instagram_basic,instagram_manage_insights,instagram_content_publish,instagram_manage_comments,read_insights,catalog_management,leads_retrieval,email";
const IG_SCOPES =
  "instagram_basic,instagram_manage_insights,instagram_content_publish,instagram_manage_comments,pages_read_engagement,pages_show_list,business_management";
const GOOGLE_CLIENT_ID = "911925145433-lnqjvdu44j1krdoq95eqpf3rjo4sf6vv.apps.googleusercontent.com";
const GOOGLE_SCOPES =
  "https://www.googleapis.com/auth/adwords https://www.googleapis.com/auth/adsense https://www.googleapis.com/auth/adsense.readonly https://www.googleapis.com/auth/analytics.manage.users https://www.googleapis.com/auth/adsdartsearch https://www.googleapis.com/auth/doubleclicksearch https://www.googleapis.com/auth/adsdatahub https://www.googleapis.com/auth/realtime-bidding https://www.googleapis.com/auth/service.management email profile";

// Load Google Identity Services script
function loadGoogleScript() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.oauth2) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Identity Services"));
    document.head.appendChild(script);
  });
}

/***************************   PROFILE - LOGIN SERVICE + AD CONNECTIONS  ***************************/

export default function SettingServiceCard() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState("");

  const fbConnected = localStorage.getItem("fb_ads_connected") === "true";
  const googleConnected = localStorage.getItem("google_ads_connected") === "true";
  const igConnected = localStorage.getItem("ig_ads_connected") === "true";

  useEffect(() => {
    if (!user?.id) return;
    fetchConnectedAccounts({ userId: user.id })
      .then((res) => {
        if (Array.isArray(res)) setAccounts(res);
        else if (res?.accounts) setAccounts(res.accounts);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?.id]);

  const googleAccounts = accounts.filter((a) => a.platform === "google");
  const metaAccounts = accounts.filter((a) => a.platform === "meta" || a.platform === "facebook");

  // Google Ads connect — uses popup (no redirect URI needed)
  const handleConnectGoogle = useCallback(async () => {
    setConnecting("google");
    try {
      await loadGoogleScript();

      const stored = localStorage.getItem(AUTH_USER_KEY);
      const userData = stored ? JSON.parse(stored) : null;
      const userId = userData?.id || user?.id;

      const client = window.google.accounts.oauth2.initCodeClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: GOOGLE_SCOPES,
        ux_mode: "popup",
        callback: async (response) => {
          if (response.error) {
            enqueueSnackbar(`Google connect failed: ${response.error}`, { variant: "error" });
            setConnecting("");
            return;
          }

          // Save connected status
          localStorage.setItem("google_ads_connected", "true");

          // Send auth code to Windmill for token exchange
          try {
            const API_BASE = import.meta.env.VITE_WINDMILL_URL || "http://localhost:8000";
            const API_WORKSPACE = import.meta.env.VITE_WINDMILL_WORKSPACE || "marketingtool";
            const WINDMILL_TOKEN = import.meta.env.VITE_WINDMILL_TOKEN || "";

            await fetch(
              `${API_BASE}/api/w/${API_WORKSPACE}/jobs/run_wait_result/p/f/tools/google-ads-connect`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${WINDMILL_TOKEN}`,
                },
                body: JSON.stringify({
                  code: response.code,
                  redirectUri: "postmessage",
                  userId,
                  appwriteJwt: userData?.access_token || "",
                }),
              },
            );
          } catch {
            /* Windmill sync non-blocking */
          }

          enqueueSnackbar("Google Ads connected successfully!", { variant: "success" });
          setConnecting("");
          // Refresh accounts
          if (userId) {
            fetchConnectedAccounts({ userId })
              .then((res) => {
                if (Array.isArray(res)) setAccounts(res);
                else if (res?.accounts) setAccounts(res.accounts);
              })
              .catch(() => {});
          }
        },
      });

      client.requestCode();
    } catch (err) {
      enqueueSnackbar(err?.message || "Failed to connect Google Ads.", { variant: "error" });
      setConnecting("");
    }
  }, [user?.id]);

  // Disconnect handler
  const handleDisconnect = (platform) => {
    if (platform === "google") {
      localStorage.removeItem("google_ads_connected");
      setAccounts((prev) => prev.filter((a) => a.platform !== "google"));
      enqueueSnackbar("Google Ads disconnected.", { variant: "info" });
    } else if (platform === "facebook") {
      localStorage.removeItem("fb_ads_connected");
      setAccounts((prev) => prev.filter((a) => a.platform !== "meta" && a.platform !== "facebook"));
      enqueueSnackbar("Meta / Facebook disconnected.", { variant: "info" });
    } else if (platform === "instagram") {
      localStorage.removeItem("ig_ads_connected");
      enqueueSnackbar("Instagram disconnected.", { variant: "info" });
    }
    // Force re-render
    setConnecting((c) => c);
  };

  // Facebook connect — redirect flow (FB doesn't support popup code flow well)
  const handleConnectFacebook = () => {
    setConnecting("facebook");
    const redirectUri = `${window.location.origin}/oauth/facebook-ads`;
    const state = crypto.randomUUID();
    sessionStorage.setItem("fb_ads_state", state);
    window.location.href =
      `https://www.facebook.com/v21.0/dialog/oauth?` +
      `client_id=${FB_APP_ID}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${encodeURIComponent(FB_SCOPES)}` +
      `&state=${state}` +
      `&response_type=token`;
  };

  // Instagram connect — redirect flow (using same Meta App but clean separate URL)
  const handleConnectInstagram = () => {
    setConnecting("instagram");
    const redirectUri = `${window.location.origin}/oauth/instagram-ads`;
    const state = crypto.randomUUID();
    sessionStorage.setItem("fb_ads_state", state);
    window.location.href =
      `https://www.facebook.com/v21.0/dialog/oauth?` +
      `client_id=${FB_APP_ID}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${encodeURIComponent(IG_SCOPES)}` +
      `&state=${state}` +
      `&response_type=token`;
  };

  return (
    <SettingCard
      title="Ad Connections"
      caption="Connect your ad platforms to manage campaigns and track performance."
    >
      <List disablePadding>
        {/* Google Ads */}
        <ListItem sx={{ p: { xs: 2, sm: 3 }, flexWrap: "wrap", gap: 1 }}>
          <ListItemAvatar sx={{ mr: 1, minWidth: 48 }}>
            <Avatar
              sx={(theme) => ({
                bgcolor: "grey.100",
                ...theme.applyStyles("dark", { bgcolor: "grey.100" }),
              })}
              variant="rounded"
              size={AvatarSize.MD}
            >
              <CardMedia component="img" src={googleImg} alt="Google" sx={{ width: "auto" }} />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary="Google Ads"
            secondary={
              googleConnected ? (
                <Stack direction="row" sx={{ gap: 0.5, alignItems: "center" }}>
                  <Chip
                    label="Connected"
                    size="small"
                    color="success"
                    variant="text"
                    avatar={<IconCheck />}
                  />
                  {googleAccounts.length > 0 && (
                    <Typography variant="caption" color="text.secondary">
                      {googleAccounts.map((a) => a.account_name || a.account_id).join(", ")}
                    </Typography>
                  )}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Connect to manage Google Ads campaigns
                </Typography>
              )
            }
            slotProps={{
              primary: { variant: "body2", color: "grey.800" },
              secondary: { component: "div", sx: { mt: 0.5 } },
            }}
          />
          <Stack direction="row" sx={{ ml: "auto", gap: 1 }}>
            {googleConnected && (
              <Button color="error" variant="text" onClick={() => handleDisconnect("google")}>
                Disconnect
              </Button>
            )}
            <Button
              disabled={!!connecting}
              onClick={handleConnectGoogle}
              startIcon={
                connecting === "google" ? <CircularProgress size={14} color="inherit" /> : null
              }
            >
              {googleConnected ? "Reconnect" : "Connect"}
            </Button>
          </Stack>
        </ListItem>

        <Divider />

        {/* Meta / Facebook */}
        <ListItem sx={{ p: { xs: 2, sm: 3 }, flexWrap: "wrap", gap: 1 }}>
          <ListItemAvatar sx={{ mr: 1, minWidth: 48 }}>
            <Avatar
              sx={(theme) => ({
                bgcolor: "rgba(24,119,242,0.04)",
                ...theme.applyStyles("dark", { bgcolor: "rgba(24,119,242,0.08)" }),
              })}
              variant="rounded"
              size={AvatarSize.MD}
            >
              <CardMedia component="img" src={facebookImg} alt="Facebook" sx={{ width: "auto" }} />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary="Meta / Facebook"
            secondary={
              fbConnected ? (
                <Stack direction="row" sx={{ gap: 0.5, alignItems: "center" }}>
                  <Chip
                    label="Connected"
                    size="small"
                    color="success"
                    variant="text"
                    avatar={<IconCheck />}
                  />
                  {metaAccounts.length > 0 && (
                    <Typography variant="caption" color="text.secondary">
                      {metaAccounts.map((a) => a.account_name || a.account_id).join(", ")}
                    </Typography>
                  )}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Connect to manage Facebook & Instagram ads
                </Typography>
              )
            }
            slotProps={{
              primary: { variant: "body2", color: "grey.800" },
              secondary: { component: "div", sx: { mt: 0.5 } },
            }}
          />
          <Stack direction="row" sx={{ ml: "auto", gap: 1 }}>
            {fbConnected && (
              <Button color="error" variant="text" onClick={() => handleDisconnect("facebook")}>
                Disconnect
              </Button>
            )}
            <Button
              disabled={!!connecting}
              onClick={handleConnectFacebook}
              startIcon={
                connecting === "facebook" ? <CircularProgress size={14} color="inherit" /> : null
              }
            >
              {fbConnected ? "Reconnect" : "Connect"}
            </Button>
          </Stack>
        </ListItem>

        <Divider />

        {/* Instagram */}
        <ListItem sx={{ p: { xs: 2, sm: 3 }, flexWrap: "wrap", gap: 1 }}>
          <ListItemAvatar sx={{ mr: 1, minWidth: 48 }}>
            <Avatar
              sx={(theme) => ({
                bgcolor: "rgba(228,64,95,0.04)",
                ...theme.applyStyles("dark", { bgcolor: "rgba(228,64,95,0.08)" }),
              })}
              variant="rounded"
              size={AvatarSize.MD}
            >
              <CardMedia
                component="img"
                src={instagramImg}
                alt="Instagram"
                sx={{ width: "auto" }}
              />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary="Instagram"
            secondary={
              igConnected ? (
                <Stack direction="row" sx={{ gap: 0.5, alignItems: "center" }}>
                  <Chip
                    label="Connected"
                    size="small"
                    color="success"
                    variant="text"
                    avatar={<IconCheck />}
                  />
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Connect your Instagram Business account
                </Typography>
              )
            }
            slotProps={{
              primary: { variant: "body2", color: "grey.800" },
              secondary: { component: "div", sx: { mt: 0.5 } },
            }}
          />
          <Stack direction="row" sx={{ ml: "auto", gap: 1 }}>
            {igConnected && (
              <Button color="error" variant="text" onClick={() => handleDisconnect("instagram")}>
                Disconnect
              </Button>
            )}
            <Button
              disabled={!!connecting}
              onClick={handleConnectInstagram}
              startIcon={
                connecting === "instagram" ? <CircularProgress size={14} color="inherit" /> : null
              }
            >
              {igConnected ? "Reconnect" : "Connect"}
            </Button>
          </Stack>
        </ListItem>
      </List>
    </SettingCard>
  );
}

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import MainCard from "components/MainCard";

const sanitizeMediaUrl = (url) => {
  if (!url) return "";
  const str = String(url).trim();

  try {
    const parsed = new URL(str, window.location.origin);
    const allowedProtocols = new Set(["blob:", "https:", "http:"]);
    if (!allowedProtocols.has(parsed.protocol)) {
      return "";
    }
    return parsed.href;
  } catch {
    return "";
  }
};

// @mui
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import LinearProgress from "@mui/material/LinearProgress";

// @assets
import {
  IconArrowLeft,
  IconSparkles,
  IconCopy,
  IconDownload,
  IconRefresh,
  IconBulb,
  IconArrowRight,
  IconFileText,
  IconCheck,
  IconWand,
  IconTarget,
  IconTrendingUp,
  IconAlertTriangle,
  IconChartBar,
  IconBolt,
  IconShieldCheck,
  IconGift,
  IconClock,
  IconScale,
  IconLock,
  IconCrown,
  IconThumbUp,
  IconMessage,
  IconShare,
  IconWorld,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconMail,
  IconPhoto,
  IconCode,
  IconBrain,
  IconRobot,
  IconEye,
  IconScan,
  IconPalette,
  IconChevronRight,
  IconStar,
  IconFlame,
  IconHeart,
  IconZoomIn,
  IconPlayerPlay,
  IconCpu,
  IconCloud,
  IconDatabase,
} from "@tabler/icons-react";

// @project
import { getToolBySlug, getRelatedTools } from "@/utils/api/tools";
import { executeGeneration } from "@/utils/api/windmill";
import { useAuth } from "@/contexts/AuthContext";

// Slug → engine type routing (matches Windmill TOOL_ROUTING)
const SLUG_TO_ENGINE = {
  // Creative engine
  "cold-outreach-email": "creative",
  "product-launch-email-sequence": "creative",
  "email-writer": "creative",
  "meta-ai-copywriter": "creative",
  "instagram-caption-generator": "creative",
  "blog-writer": "creative",
  "sales-page-copy-writer": "creative",
  "cta-writer": "creative",
  "seo-title-generator": "creative",
  "linkedin-ad-copy-generator": "creative",
  "article-generator": "creative",
  "product-description-writer": "creative",
  // Automation engine
  "campaign-optimization-engine": "automation",
  "workflow-automation-builder": "automation",
  "smart-scheduling-engine": "automation",
  "bid-optimization-engine": "automation",
  "budget-manager": "automation",
  "rule-based-campaign-manager": "automation",
  "post-scheduler": "automation",
  "retargeting-funnel-builder": "automation",
  "lead-magnet-creator": "automation",
  "milestone-email-automator": "automation",
  "campaign-ab-test-manager": "automation",
  "ai-paid-social-manager": "automation",
  // Insight engine
  "marketing-kpi-dashboard": "insight",
  "competitor-analysis-tool": "insight",
  "keyword-research-tool": "insight",
  "quality-score-checker": "insight",
  "performance-auto-alerts": "insight",
  "roi-calculator": "insight",
  "ad-intelligence-software": "insight",
  "multi-channel-attribution": "insight",
  "conversion-path-analyzer": "insight",
  "marketing-budget-planner": "insight",
  "google-trends-tool": "insight",
  "reporting-tools": "insight",
};

/* ═══════════════════════════════════════════════════════════════
   OBSIDIAN LUXE — Design Tokens
   ═══════════════════════════════════════════════════════════════ */

const G = {
  bg: "rgba(12, 12, 16, 0.72)",
  surface: "rgba(255,255,255,0.025)",
  surfaceHover: "rgba(255,255,255,0.05)",
  border: "rgba(255,255,255,0.06)",
  borderHover: "rgba(255,255,255,0.12)",
  blur: "blur(50px)",
  shadow: "0 8px 40px -12px rgba(0,0,0,0.5)",
  inner: "inset 0 1px 0 0 rgba(255,255,255,0.04)",
  radius: "22px",
  radiusMd: "16px",
  radiusSm: "12px",
};

/* ═══════════════════  ANGLE TABS (Creative Engine)  ═══════════════════ */

const ANGLE_TABS = [
  {
    label: "Pain Point",
    key: "Pain",
    accent: "rgba(255,255,255,0.85)",
    glow: "rgba(255,255,255,0.06)",
    gradient: "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))",
    icon: IconBolt,
  },
  {
    label: "Social Proof",
    key: "Proof",
    accent: "rgba(255,255,255,0.85)",
    glow: "rgba(255,255,255,0.06)",
    gradient: "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))",
    icon: IconShieldCheck,
  },
  {
    label: "Offer",
    key: "Offer",
    accent: "rgba(255,255,255,0.85)",
    glow: "rgba(255,255,255,0.06)",
    gradient: "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))",
    icon: IconGift,
  },
  {
    label: "Urgency",
    key: "Urgency",
    accent: "rgba(255,255,255,0.85)",
    glow: "rgba(255,255,255,0.06)",
    gradient: "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))",
    icon: IconClock,
  },
  {
    label: "Comparison",
    key: "Comparison",
    accent: "rgba(255,255,255,0.85)",
    glow: "rgba(255,255,255,0.06)",
    gradient: "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))",
    icon: IconScale,
  },
];

function getAngleTab(angle) {
  return ANGLE_TABS.find((t) => t.key === angle) || ANGLE_TABS[0];
}

/* ═══════════════════  BADGE → IMAGES  ═══════════════════ */

const getIconImage = (badge) => {
  const m = {
    Grader: "/images/icons/data-analytic-3d.png",
    "Google Ads": "/images/icons/marketing-strategy-3d.png",
    Audit: "/images/icons/optimization-3d.png",
    Campaign: "/images/icons/promotion-3d.png",
    Budget: "/images/icons/data-analytic-3d.png",
    "PPC Optimization": "/images/icons/backlink-3d.png",
    "Facebook/Meta": "/images/icons/facebook-3d.png",
    Instagram: "/images/icons/social-media-engagement-3d.png",
    Creative: "/images/icons/copywriting-3d.png",
    "Social Media": "/images/icons/social-media-engagement-3d.png",
    SEO: "/images/icons/optimization-3d.png",
    "Content Writing": "/images/icons/copywriting-3d.png",
    Analytics: "/images/icons/data-analytic-3d.png",
    "ROI & Attribution": "/images/icons/data-analytic-3d.png",
    Email: "/images/icons/copywriting-3d.png",
    Copywriting: "/images/icons/copywriting-3d.png",
    Marketing: "/images/icons/marketing-strategy-3d.png",
    Automation: "/images/icons/backlink-3d.png",
    "E-commerce": "/images/icons/promotion-3d.png",
    LinkedIn: "/images/icons/social-media-engagement-3d.png",
    "AI Agent": "/images/icons/marketing-strategy-3d.png",
  };
  return m[badge] || "/images/icons/marketing-strategy-3d.png";
};

const getBannerImage = (badge) => {
  const m = {
    Email: "/images/chat/bew-email-ai.jpg",
    Copywriting: "/images/chat/ai-content.jpg",
    "Content Writing": "/images/chat/ai-content.jpg",
    "Facebook/Meta": "/images/chat/bew-facebook.jpg",
    "Google Ads": "/images/chat/auto-google-ads.jpg",
    Instagram: "/images/chat/bew-social-guide.jpg",
    LinkedIn: "/images/chat/bew-automation.jpg",
    "Social Media": "/images/chat/auto-team-social.jpg",
    SEO: "/images/chat/bew-seo.jpg",
    Analytics: "/images/chat/bew-analytics-float.jpg",
    "ROI & Attribution": "/images/chat/bew-google-dash.jpg",
    Campaign: "/images/chat/bew-fb-manager.jpg",
    Automation: "/images/chat/ai-automation.jpg",
    Budget: "/images/chat/ai-money.jpg",
    "E-commerce": "/images/chat/auto-shopping.jpg",
    "PPC Optimization": "/images/chat/auto-google-ads.jpg",
    Marketing: "/images/chat/ai-marketing.jpg",
    Creative: "/images/chat/bew-web-design.jpg",
    Grader: "/images/chat/adlib-saas-dash.jpg",
    Audit: "/images/chat/bew-audit.jpg",
    "AI Agent": "/images/chat/bew-ai-robot.jpg",
  };
  return m[badge] || "/images/chat/ai-marketing.jpg";
};

const VARIANT_IMAGES = [
  "/images/chat/bew-email-ai.jpg",
  "/images/chat/ai-content.jpg",
  "/images/chat/bew-automation.jpg",
  "/images/chat/bew-web-design.jpg",
  "/images/chat/ai-marketing.jpg",
  "/images/chat/bew-analytics-float.jpg",
  "/images/chat/bew-social-guide.jpg",
  "/images/chat/auto-google-ads.jpg",
  "/images/chat/bew-facebook.jpg",
  "/images/chat/ai-automation.jpg",
  "/images/chat/auto-team-social.jpg",
  "/images/chat/bew-seo.jpg",
  "/images/chat/ai-money.jpg",
  "/images/chat/bew-google-dash.jpg",
  "/images/chat/auto-shopping.jpg",
  "/images/chat/adlib-saas-dash.jpg",
  "/images/chat/bew-audit.jpg",
  "/images/chat/bew-ai-robot.jpg",
];

function getVariantImage(badge, index) {
  const primary = getBannerImage(badge);
  const pool = VARIANT_IMAGES.filter((img) => img !== primary);
  if (index === 0) return primary;
  return pool[(index - 1) % pool.length];
}

/* ═══════════════════  RICH TEXT  ═══════════════════ */

function parseBold(text) {
  if (!text || typeof text !== "string") return text;
  const segs = [];
  let rest = text;
  let k = 0;
  while (rest) {
    const m = rest.match(/\*\*(.+?)\*\*/);
    if (m) {
      if (m.index > 0) segs.push(rest.slice(0, m.index));
      segs.push(
        <strong key={k++} style={{ color: "#e2e8f0", fontWeight: 700 }}>
          {m[1]}
        </strong>,
      );
      rest = rest.slice(m.index + m[0].length);
    } else {
      segs.push(rest);
      break;
    }
  }
  return segs.length === 1 && typeof segs[0] === "string" ? segs[0] : segs;
}

function RichText({ content, accentColor }) {
  if (!content) return null;
  const text = typeof content === "string" ? content : JSON.stringify(content, null, 2);
  const a = accentColor || "#6366f1";
  return (
    <Box sx={{ "& > *:first-of-type": { mt: 0 } }}>
      {text.split("\n").map((line, i) => {
        const t = line.trim();
        if (!t) return <Box key={i} sx={{ height: 12 }} />;
        if (/^-{3,}$/.test(t) || /^={3,}$/.test(t))
          return <Divider key={i} sx={{ my: 3, borderColor: "rgba(255,255,255,0.06)" }} />;
        if (t.startsWith("# "))
          return (
            <Typography
              key={i}
              sx={{
                fontWeight: 800,
                fontSize: "1.3rem",
                mt: 3,
                mb: 1.5,
                color: "#f1f5f9",
                letterSpacing: "-0.03em",
                lineHeight: 1.3,
                pl: 2.5,
                borderLeft: `3px solid ${a}`,
                py: 0.5,
              }}
            >
              {parseBold(t.slice(2))}
            </Typography>
          );
        if (t.startsWith("## "))
          return (
            <Typography
              key={i}
              sx={{
                fontWeight: 700,
                fontSize: "1.1rem",
                mt: 3,
                mb: 1,
                color: "#e2e8f0",
                letterSpacing: "-0.02em",
              }}
            >
              {parseBold(t.slice(3))}
            </Typography>
          );
        if (t.startsWith("### "))
          return (
            <Stack
              key={i}
              direction="row"
              sx={{ alignItems: "center", gap: 1.25, mt: 2.5, mb: 0.75 }}
            >
              <Box
                sx={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  bgcolor: a,
                  boxShadow: `0 0 8px ${a}60`,
                }}
              />
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "0.97rem",
                  color: "#cbd5e1",
                  letterSpacing: "-0.01em",
                }}
              >
                {parseBold(t.slice(4))}
              </Typography>
            </Stack>
          );
        if (/^[✓✔] /.test(t))
          return (
            <Stack
              key={i}
              direction="row"
              sx={{ gap: 1.25, pl: 1, mb: 0.5, alignItems: "flex-start" }}
            >
              <Box
                sx={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  mt: "3px",
                  flexShrink: 0,
                  background: `${a}15`,
                  border: `1px solid ${a}30`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IconCheck size={12} style={{ color: a }} />
              </Box>
              <Typography
                sx={{ fontSize: "0.88rem", lineHeight: 1.85, color: "rgba(255,255,255,0.75)" }}
              >
                {parseBold(t.slice(2))}
              </Typography>
            </Stack>
          );
        if (/^[-•*] /.test(t))
          return (
            <Stack
              key={i}
              direction="row"
              sx={{ gap: 1.25, pl: 1, mb: 0.5, alignItems: "flex-start" }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  bgcolor: a,
                  mt: "11px",
                  flexShrink: 0,
                  opacity: 0.85,
                }}
              />
              <Typography
                sx={{ fontSize: "0.88rem", lineHeight: 1.85, color: "rgba(255,255,255,0.75)" }}
              >
                {parseBold(t.slice(2))}
              </Typography>
            </Stack>
          );
        const numMatch = t.match(/^(\d+)\.\s(.+)/);
        if (numMatch)
          return (
            <Stack
              key={i}
              direction="row"
              sx={{ gap: 1.25, pl: 0.5, mb: 0.5, alignItems: "flex-start" }}
            >
              <Box
                sx={{
                  minWidth: 26,
                  height: 26,
                  borderRadius: "50%",
                  mt: "3px",
                  flexShrink: 0,
                  background: `${a}12`,
                  border: `1px solid ${a}22`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.7rem",
                    fontWeight: 800,
                    color: a,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {numMatch[1]}
                </Typography>
              </Box>
              <Typography
                sx={{ fontSize: "0.88rem", lineHeight: 1.85, color: "rgba(255,255,255,0.75)" }}
              >
                {parseBold(numMatch[2])}
              </Typography>
            </Stack>
          );
        if (t.startsWith("**") && t.endsWith("**"))
          return (
            <Typography
              key={i}
              sx={{
                fontWeight: 700,
                fontSize: "0.95rem",
                lineHeight: 1.85,
                color: "#e2e8f0",
                mt: 1.5,
              }}
            >
              {t.slice(2, -2)}
            </Typography>
          );
        return (
          <Typography
            key={i}
            sx={{ fontSize: "0.88rem", lineHeight: 1.85, color: "rgba(255,255,255,0.72)" }}
          >
            {parseBold(t)}
          </Typography>
        );
      })}
    </Box>
  );
}

/* ═══════════════════  SCORE GAUGE  ═══════════════════ */

function ScoreGauge({ score, size = 64, showLabel = false, label }) {
  const s = Number(score) || 0;
  const r = (size - 8) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (s / 100) * circumference;
  const gradId = `sg-${size}-${Math.random().toString(36).slice(2, 6)}`;

  return (
    <Box sx={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.85)" stopOpacity="1" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.25)" stopOpacity="1" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="4"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth="4.5"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{
            transition: "stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
            filter: "drop-shadow(0 0 6px rgba(255,255,255,0.06))",
          }}
        />
      </svg>
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: size * 0.28,
            fontWeight: 900,
            color: "rgba(255,255,255,0.85)",
            fontVariantNumeric: "tabular-nums",
            lineHeight: 1,
          }}
        >
          {s}
        </Typography>
        {showLabel && label && (
          <Typography
            sx={{
              fontSize: size * 0.13,
              color: "rgba(255,255,255,0.3)",
              fontWeight: 600,
              mt: 0.25,
            }}
          >
            {label}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

/* ═══════════════════  METRIC CARD  ═══════════════════ */

function MetricCard({ label, value }) {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: G.radiusSm,
        bgcolor: "rgba(255,255,255,0.02)",
        border: `1px solid ${G.border}`,
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.3s ease",
        "&:hover": {
          bgcolor: "rgba(255,255,255,0.035)",
          borderColor: G.borderHover,
          transform: "translateY(-1px)",
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: "20%",
          right: "20%",
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
        },
      }}
    >
      <Typography
        sx={{
          fontSize: "0.62rem",
          fontWeight: 700,
          color: "rgba(255,255,255,0.3)",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          mb: 0.75,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: "1.15rem",
          fontWeight: 900,
          color: "rgba(255,255,255,0.85)",
          fontVariantNumeric: "tabular-nums",
          lineHeight: 1,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

/* ═══════════════════  METRIC BAR  ═══════════════════ */

function MetricBar({ label, value, max = 100, suffix = "", delay = 0 }) {
  const pct = Math.min(100, Math.max(0, (Number(value) / max) * 100));
  return (
    <Box sx={{ mb: 1.5 }}>
      <Stack direction="row" sx={{ justifyContent: "space-between", mb: 0.5 }}>
        <Typography sx={{ fontSize: "0.72rem", fontWeight: 600, color: "rgba(255,255,255,0.4)" }}>
          {label}
        </Typography>
        <Typography
          sx={{
            fontSize: "0.72rem",
            fontWeight: 800,
            color: "rgba(255,255,255,0.7)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {value}
          {suffix}
        </Typography>
      </Stack>
      <Box
        sx={{ height: 5, borderRadius: 3, bgcolor: "rgba(255,255,255,0.04)", overflow: "hidden" }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, delay, ease: [0.4, 0, 0.2, 1] }}
          style={{
            height: "100%",
            borderRadius: 12,
            background: "linear-gradient(90deg, rgba(255,255,255,0.7), rgba(255,255,255,0.4))",
            boxShadow: "0 0 10px rgba(255,255,255,0.04)",
          }}
        />
      </Box>
    </Box>
  );
}

/* ═══════════════════  PDF EXPORT  ═══════════════════ */

function exportEnginePdf(toolName, engineResponse) {
  const d = engineResponse?.data || {};
  const engine = engineResponse?.engine || "creative";
  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const accent = "#6366f1";

  let bodyHtml = "";

  if (engine === "creative") {
    const variants = d.variants || [];
    bodyHtml += `<div class="score-bar"><span class="score">${d.overallScore || 0}/100</span><span class="rec">${d.recommendation || ""}</span></div>`;
    variants.forEach((v, i) => {
      const ac = getAngleTab(v.angle);
      bodyHtml += `<div class="variant"><div class="v-head" style="border-left:4px solid ${ac.accent}"><span class="angle" style="color:${ac.accent}">${v.angle}</span><span class="v-score">Score: ${v.performanceScore || 0}</span></div>`;
      bodyHtml += `<h3>${v.headline || ""}</h3>`;
      bodyHtml += `<p class="hook">${v.hook || ""}</p>`;
      bodyHtml += `<div class="copy">${(v.primaryCopy || "").replace(/\n/g, "<br/>")}</div>`;
      bodyHtml += `<div class="cta-btn">${v.cta || ""}</div>`;
      if (v.targeting)
        bodyHtml += `<div class="targeting"><strong>Targeting:</strong> ${v.targeting.audience_type || ""} | ${v.targeting.funnel_stage || ""} | ${v.targeting.objective || ""}</div>`;
      if (v.hashtags?.length)
        bodyHtml += `<div class="tags">${v.hashtags.map((t) => `#${t}`).join(" ")}</div>`;
      bodyHtml += `</div>`;
    });
  } else if (engine === "automation") {
    bodyHtml += `<div class="score-bar"><span class="score">${d.overallScore || 0}/100</span><span class="status">${d.healthStatus || ""}</span></div>`;
    if (d.diagnosis)
      bodyHtml += `<div class="diag"><h3>Diagnosis</h3><p><strong>${d.diagnosis.primaryIssue || ""}</strong></p><p>Severity: ${d.diagnosis.severity || ""} | Estimated Waste: $${d.diagnosis.estimatedMonthlyWaste || 0}/mo</p><p>${d.diagnosis.details || ""}</p></div>`;
    (d.actionsGenerated || []).forEach((a) => {
      bodyHtml += `<div class="action"><strong>${a.type}:</strong> ${a.rule} <em>(${a.expectedImpact}, Risk: ${a.riskLevel})</em></div>`;
    });
    if (d.projectedOutcome)
      bodyHtml += `<div class="proj"><h3>Projected Outcome</h3><p>ROAS: ${d.projectedOutcome.newROAS} | Cost Reduction: ${d.projectedOutcome.costReduction} | Revenue: ${d.projectedOutcome.revenueIncrease}</p></div>`;
  } else {
    bodyHtml += `<div class="score-bar"><span class="score">${d.overallScore || 0}/100</span><span class="status">${d.healthStatus || ""}</span></div>`;
    if (d.kpiSnapshot)
      bodyHtml += `<div class="kpi"><h3>KPI Snapshot</h3><p>ROAS: ${d.kpiSnapshot.roas} | CTR: ${d.kpiSnapshot.ctr}% | CPA: $${d.kpiSnapshot.cpa} | Spend: $${d.kpiSnapshot.spend} | Revenue: $${d.kpiSnapshot.revenue}</p></div>`;
    (d.topIssues || []).forEach((iss) => {
      bodyHtml += `<div class="issue"><strong>${iss.issue}</strong> — ${iss.severity} (Impact: $${iss.financialImpact}) — ${iss.recommendation}</div>`;
    });
    (d.topOpportunities || []).forEach((opp) => {
      bodyHtml += `<div class="opp"><strong>${opp.opportunity}</strong> — ${opp.potentialLift} (+$${opp.estimatedRevenueIncrease}) — ${opp.recommendation}</div>`;
    });
  }

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${toolName} — ${engine}</title>
<style>@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
*{margin:0;padding:0;box-sizing:border-box}body{font-family:'DM Sans',system-ui,sans-serif;padding:48px 56px;color:#334155;line-height:1.7;background:#fafbfc}
.hd{display:flex;align-items:center;gap:16px;margin-bottom:32px;padding-bottom:18px;border-bottom:2px solid ${accent}}
.hd h1{font-size:20px;font-weight:800;color:#0f172a}.score-bar{display:flex;align-items:center;gap:16px;padding:16px 20px;background:#f1f5f9;border-radius:12px;margin-bottom:24px}
.score{font-size:28px;font-weight:800;color:${accent}}.rec,.status{font-size:13px;color:#64748b}
.variant{margin-bottom:24px;padding:20px;border:1px solid #e2e8f0;border-radius:12px}.v-head{display:flex;justify-content:space-between;padding-left:12px;margin-bottom:12px}
.angle{font-weight:800;font-size:13px;text-transform:uppercase;letter-spacing:0.05em}.v-score{font-size:12px;color:#64748b;font-weight:600}
h3{font-size:17px;font-weight:700;color:#0f172a;margin:8px 0}.hook{color:#6366f1;font-style:italic;margin-bottom:12px}
.copy{font-size:14px;margin-bottom:12px;padding:12px;background:#f8fafc;border-radius:8px}.cta-btn{display:inline-block;padding:8px 24px;background:${accent};color:#fff;border-radius:8px;font-weight:700;font-size:13px;margin-bottom:12px}
.targeting,.tags{font-size:12px;color:#64748b;margin-bottom:4px}.diag,.proj,.kpi{padding:16px;background:#f8fafc;border-radius:10px;margin-bottom:16px}
.action,.issue,.opp{padding:12px 16px;border-left:3px solid ${accent};margin-bottom:8px;font-size:13px;background:#fafbfc;border-radius:0 8px 8px 0}
.ft{margin-top:40px;padding-top:14px;border-top:1px solid #e2e8f0;color:#94a3b8;font-size:10px;text-align:center}
@media print{body{padding:32px 40px}@page{margin:0.5in}}</style></head><body>
<div class="hd"><h1>${toolName}</h1></div>${bodyHtml}
<div class="ft">Generated by MarketingTool.pro &mdash; ${dateStr}</div></body></html>`;

  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const blobUrl = URL.createObjectURL(blob);
  const w = window.open(blobUrl, "_blank");
  if (w) w.addEventListener("load", () => setTimeout(() => w.print(), 700));
  setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
}

/* ═══════════════════  SHIMMER SKELETON  ═══════════════════ */

function ResultSkeleton({ toolSlug }) {
  const [step, setStep] = useState(0);
  const isScheduler = toolSlug === "post-scheduler";

  const steps = [
    { label: "Creative Image Generation", icon: <IconSparkles size={16} />, duration: 3000 },
    { label: "AI Video Synthesis (FAL.ai)", icon: <IconPlayerPlay size={16} />, duration: 4000 },
    { label: "Optimal Timing Calculation", icon: <IconClock size={16} />, duration: 2500 },
    { label: "Finalising Post Preview", icon: <IconLayout size={16} />, duration: 2000 },
  ];

  useEffect(() => {
    if (!isScheduler) return;
    const interval = setInterval(() => {
      setStep((s) => (s < steps.length - 1 ? s + 1 : s));
    }, steps[step]?.duration || 3000);
    return () => clearInterval(interval);
  }, [step, isScheduler]);

  const shimmerSx = {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.03) 50%, transparent 100%)",
    animation: "shimmerSlide 1.8s ease-in-out infinite",
    "@keyframes shimmerSlide": {
      "0%": { transform: "translateX(-100%)" },
      "100%": { transform: "translateX(100%)" },
    },
  };

  return (
    <Box
      sx={{
        borderRadius: 4,
        overflow: "hidden",
        background: "rgba(0,0,0,0.2)",
        border: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      {isScheduler ? (
        <Box sx={{ p: 4, textAlign: "center" }}>
          <Box sx={{ position: "relative", display: "inline-flex", mb: 3 }}>
            <CircularProgress
              size={80}
              thickness={2}
              sx={{ color: "rgba(139,92,246,0.15)" }}
              variant="determinate"
              value={100}
            />
            <CircularProgress
              size={80}
              thickness={4}
              sx={{
                color: "#8b5cf6",
                position: "absolute",
                left: 0,
                [`& .MuiCircularProgress-circle`]: {
                  strokeLinecap: "round",
                },
              }}
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: "absolute",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#8b5cf6",
              }}
            >
              <motion.div
                key={step}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                {steps[step].icon}
              </motion.div>
            </Box>
          </Box>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Typography sx={{ fontWeight: 800, fontSize: "1.1rem", mb: 1, color: "#fff" }}>
                {steps[step].label}
              </Typography>
              <Typography sx={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)" }}>
                Step {step + 1} of {steps.length} — Processing through 10-model pipeline
              </Typography>
            </motion.div>
          </AnimatePresence>
          <Stack
            direction="row"
            spacing={1}
            sx={{ mt: 4, justifyContent: "center", alignItems: "center" }}
          >
            {steps.map((_, i) => (
              <Box
                key={i}
                sx={{
                  width: i === step ? 24 : 8,
                  height: 4,
                  borderRadius: 1,
                  bgcolor: i <= step ? "#8b5cf6" : "rgba(255,255,255,0.1)",
                  transition: "all 0.4s ease",
                }}
              />
            ))}
          </Stack>
        </Box>
      ) : (
        <>
          <Box
            sx={{
              height: 100,
              position: "relative",
              overflow: "hidden",
              background: "rgba(255,255,255,0.015)",
            }}
          >
            <Box sx={shimmerSx} />
          </Box>
          <Box sx={{ p: 3.5 }}>
            {[85, 100, 45, 95, 72, 100, 60, 88, 40].map((w, i) => (
              <Box
                key={i}
                sx={{
                  height: i === 0 ? 16 : 11,
                  borderRadius: 1,
                  mb: i === 0 ? 2.5 : 1.5,
                  width: `${w}%`,
                  position: "relative",
                  overflow: "hidden",
                  bgcolor: i === 0 ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.025)",
                }}
              >
                <Box sx={{ ...shimmerSx, animationDelay: `${i * 0.12}s` }} />
              </Box>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
}

/* ═══════════════════════════════════════════════════════════════
   AI MODEL ATTRIBUTION STRIP
   ═══════════════════════════════════════════════════════════════ */

const MODEL_INFO = {
  creative: { label: "Claude Sonnet 4", icon: IconBrain, color: "#c084fc", provider: "Anthropic" },
  research: { label: "Gemini 2.5 Flash", icon: IconEye, color: "#60a5fa", provider: "Google" },
  coding: { label: "Claude Sonnet 4", icon: IconCode, color: "#34d399", provider: "Anthropic" },
  image_gen: { label: "DALL-E 3", icon: IconPhoto, color: "#fb923c", provider: "OpenAI" },
  vision_analysis: { label: "DALL-E 3", icon: IconScan, color: "#f472b6", provider: "OpenRouter" },
  ocr: { label: "Qwen3-VL", icon: IconScan, color: "#a78bfa", provider: "OpenRouter" },
  automation: { label: "Llama 3.3 70B", icon: IconRobot, color: "#fbbf24", provider: "Groq" },
  default: { label: "Claude Sonnet 4", icon: IconBrain, color: "#c084fc", provider: "Anthropic" },
};

function ModelsUsedStrip({ modelsUsed, latencyMs }) {
  const models = modelsUsed || [];
  if (!models.length) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Box
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(135deg, rgba(99,102,241,0.04) 0%, rgba(139,92,246,0.02) 50%, rgba(6,182,212,0.03) 100%)",
          border: "1px solid rgba(99,102,241,0.1)",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(99,102,241,0.3), rgba(139,92,246,0.3), rgba(6,182,212,0.3), transparent)",
          },
        }}
      >
        <Stack direction="row" sx={{ alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
          <Stack direction="row" sx={{ alignItems: "center", gap: 0.75 }}>
            <IconCpu size={13} style={{ color: "rgba(255,255,255,0.35)" }} />
            <Typography
              sx={{
                fontSize: "0.6rem",
                fontWeight: 700,
                color: "rgba(255,255,255,0.3)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Powered by
            </Typography>
          </Stack>
          {models.map((taskName) => {
            const info = MODEL_INFO[taskName];
            if (!info) return null;
            const MIcon = info.icon;
            return (
              <Chip
                key={taskName}
                size="small"
                icon={<MIcon size={11} />}
                label={`${info.label}`}
                sx={{
                  height: 22,
                  fontSize: "0.58rem",
                  fontWeight: 700,
                  bgcolor: `${info.color}10`,
                  color: info.color,
                  border: `1px solid ${info.color}20`,
                  "& .MuiChip-icon": { color: info.color },
                }}
              />
            );
          })}
          {latencyMs > 0 && (
            <Typography
              sx={{
                fontSize: "0.58rem",
                fontWeight: 600,
                color: "rgba(255,255,255,0.2)",
                ml: "auto",
              }}
            >
              {(latencyMs / 1000).toFixed(1)}s
            </Typography>
          )}
        </Stack>
      </Box>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   BENCHMARKS SECTION (from Gemini research enrichment)
   ═══════════════════════════════════════════════════════════════ */

function BenchmarksSection({ benchmarks }) {
  if (!benchmarks || typeof benchmarks !== "object") return null;
  const competitors = benchmarks.competitors || [];
  const industryAvg = benchmarks.industryAvg || {};
  const trending = benchmarks.trending || [];
  if (!competitors.length && !Object.keys(industryAvg).length && !trending.length) {
    if (benchmarks.raw)
      return (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Box
            sx={{
              p: 2.5,
              mb: 3,
              borderRadius: 3,
              bgcolor: "rgba(96,165,250,0.04)",
              border: "1px solid rgba(96,165,250,0.1)",
            }}
          >
            <Stack direction="row" sx={{ alignItems: "center", gap: 1, mb: 1.5 }}>
              <IconEye size={14} style={{ color: "#60a5fa" }} />
              <Typography sx={{ fontWeight: 800, fontSize: "0.82rem", color: "#60a5fa" }}>
                Market Intelligence
              </Typography>
            </Stack>
            <RichText content={benchmarks.raw} accentColor="#60a5fa" />
          </Box>
        </motion.div>
      );
    return null;
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" sx={{ alignItems: "center", gap: 1, mb: 2 }}>
          <IconEye size={14} style={{ color: "#60a5fa" }} />
          <Typography
            sx={{
              fontSize: "0.6rem",
              fontWeight: 700,
              color: "rgba(255,255,255,0.25)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Market Intelligence
          </Typography>
        </Stack>
        <Grid container spacing={1.5}>
          {Object.keys(industryAvg).length > 0 && (
            <Grid size={{ xs: 12, md: competitors.length > 0 ? 4 : 12 }}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 3,
                  bgcolor: "rgba(96,165,250,0.04)",
                  border: "1px solid rgba(96,165,250,0.08)",
                  height: "100%",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.25)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    mb: 1.5,
                  }}
                >
                  Industry Averages
                </Typography>
                {Object.entries(industryAvg).map(([k, v]) => (
                  <Stack
                    key={k}
                    direction="row"
                    sx={{ justifyContent: "space-between", mb: 0.75, alignItems: "center" }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.72rem",
                        color: "rgba(255,255,255,0.45)",
                        textTransform: "uppercase",
                      }}
                    >
                      {k}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.85rem",
                        fontWeight: 800,
                        color: "#60a5fa",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {typeof v === "number" ? v.toFixed(1) : v}
                      {typeof v === "number" && k.includes("c") ? "%" : ""}
                    </Typography>
                  </Stack>
                ))}
              </Box>
            </Grid>
          )}
          {competitors.length > 0 && (
            <Grid size={{ xs: 12, md: 8 }}>
              <Stack spacing={1}>
                {competitors.slice(0, 3).map((c, i) => (
                  <Box
                    key={i}
                    sx={{
                      p: 2,
                      borderRadius: 2.5,
                      bgcolor: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      transition: "all 0.25s",
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,0.035)",
                        transform: "translateX(4px)",
                      },
                    }}
                  >
                    <Stack
                      direction="row"
                      sx={{ justifyContent: "space-between", alignItems: "center" }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: "0.82rem",
                          color: "rgba(255,255,255,0.8)",
                        }}
                      >
                        {c.name}
                      </Typography>
                      <Chip
                        label={`#${i + 1}`}
                        size="small"
                        sx={{
                          height: 18,
                          fontSize: "0.52rem",
                          fontWeight: 900,
                          bgcolor: "rgba(255,255,255,0.04)",
                          color: "rgba(255,255,255,0.4)",
                        }}
                      />
                    </Stack>
                    <Stack direction="row" sx={{ gap: 2, mt: 0.5 }}>
                      {c.strength && (
                        <Typography sx={{ fontSize: "0.68rem", color: "#34d399" }}>
                          + {c.strength}
                        </Typography>
                      )}
                      {c.weakness && (
                        <Typography sx={{ fontSize: "0.68rem", color: "#f87171" }}>
                          − {c.weakness}
                        </Typography>
                      )}
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Grid>
          )}
        </Grid>
        {trending.length > 0 && (
          <Stack direction="row" sx={{ gap: 1, mt: 1.5, flexWrap: "wrap" }}>
            <IconFlame size={13} style={{ color: "#fb923c", marginTop: 2 }} />
            {trending.map((t, i) => (
              <Chip
                key={i}
                label={t}
                size="small"
                sx={{
                  height: 22,
                  fontSize: "0.62rem",
                  fontWeight: 600,
                  bgcolor: "rgba(251,146,60,0.06)",
                  color: "#fb923c",
                  border: "1px solid rgba(251,146,60,0.12)",
                }}
              />
            ))}
          </Stack>
        )}
      </Box>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PLATFORM AD PREVIEW MOCKUPS (Facebook, Instagram, LinkedIn)
   ═══════════════════════════════════════════════════════════════ */

function PlatformPreviews({ variant, toolName, uploadedMedia }) {
  const [activePlatform, setActivePlatform] = useState("facebook");
  const imgSrc = sanitizeMediaUrl(uploadedMedia?.url || variant.image_url);
  const isVideo = uploadedMedia?.type === "video";

  const platforms = [
    { id: "facebook", label: "Facebook", icon: IconBrandFacebook, color: "#1877f2" },
    { id: "instagram", label: "Instagram", icon: IconBrandInstagram, color: "#e4405f" },
    { id: "linkedin", label: "LinkedIn", icon: IconBrandLinkedin, color: "#0a66c2" },
  ];

  const MediaElement = () => {
    if (isVideo)
      return (
        <video
          src={sanitizeMediaUrl(uploadedMedia.url)}
          muted
          loop
          autoPlay
          playsInline
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      );
    if (imgSrc)
      return (
        <Box
          component="img"
          src={imgSrc}
          alt=""
          sx={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      );
    return (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, rgba(128,90,245,0.08), rgba(99,102,241,0.04))",
        }}
      >
        <IconPhoto size={32} style={{ color: "rgba(255,255,255,0.08)" }} />
      </Box>
    );
  };

  return (
    <Box>
      {/* Platform tabs */}
      <Stack direction="row" sx={{ gap: 0.5, mb: 2 }}>
        {platforms.map(({ id, label, icon: PIcon, color }) => (
          <Button
            key={id}
            size="small"
            startIcon={<PIcon size={14} />}
            onClick={() => setActivePlatform(id)}
            sx={{
              borderRadius: 2,
              px: 2,
              py: 0.75,
              fontSize: "0.72rem",
              fontWeight: 700,
              textTransform: "none",
              bgcolor: activePlatform === id ? `${color}18` : "rgba(255,255,255,0.02)",
              color: activePlatform === id ? color : "rgba(255,255,255,0.4)",
              border: `1px solid ${activePlatform === id ? `${color}30` : "rgba(255,255,255,0.06)"}`,
              "&:hover": { bgcolor: `${color}12`, color },
            }}
          >
            {label}
          </Button>
        ))}
      </Stack>

      <AnimatePresence mode="wait">
        <motion.div
          key={activePlatform}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
        >
          {/* Facebook Preview */}
          {activePlatform === "facebook" && (
            <Box
              sx={{
                borderRadius: 2.5,
                overflow: "hidden",
                bgcolor: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <Stack direction="row" sx={{ alignItems: "center", gap: 1.5, px: 2, py: 1.5 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    bgcolor: "rgba(24,119,242,0.12)",
                    border: "1px solid rgba(24,119,242,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IconBrandFacebook size={16} style={{ color: "#1877f2" }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{ fontWeight: 700, fontSize: "0.85rem", color: "rgba(255,255,255,0.9)" }}
                  >
                    {toolName || "Brand"}
                  </Typography>
                  <Typography sx={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.35)" }}>
                    Sponsored · <IconWorld size={10} style={{ verticalAlign: "middle" }} />
                  </Typography>
                </Box>
              </Stack>
              <Box sx={{ px: 2, pb: 1.5 }}>
                <Typography
                  sx={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.65 }}
                >
                  {variant.hook || variant.headline || ""}
                </Typography>
              </Box>
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "1.91 / 1",
                  bgcolor: "rgba(0,0,0,0.4)",
                }}
              >
                <MediaElement />
              </Box>
              <Stack
                direction="row"
                sx={{
                  alignItems: "center",
                  justifyContent: "space-between",
                  px: 2,
                  py: 1.5,
                  bgcolor: "rgba(255,255,255,0.02)",
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <Box sx={{ flex: 1, mr: 2 }}>
                  <Typography
                    sx={{
                      fontSize: "0.7rem",
                      color: "rgba(255,255,255,0.3)",
                      textTransform: "uppercase",
                    }}
                  >
                    {toolName || "brand"}.com
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: "0.9rem",
                      color: "rgba(255,255,255,0.9)",
                      lineHeight: 1.25,
                      mt: 0.25,
                    }}
                  >
                    {variant.headline || "Headline"}
                  </Typography>
                </Box>
                <Button
                  size="small"
                  sx={{
                    px: 2.5,
                    py: 0.75,
                    borderRadius: 1.5,
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    textTransform: "none",
                    flexShrink: 0,
                    bgcolor: "rgba(24,119,242,0.15)",
                    color: "#60a5fa",
                    border: "1px solid rgba(24,119,242,0.25)",
                    "&:hover": { bgcolor: "rgba(24,119,242,0.25)" },
                  }}
                >
                  {variant.cta || "Learn More"}
                </Button>
              </Stack>
              <Stack
                direction="row"
                sx={{ px: 2, py: 1.25, gap: 4, borderTop: "1px solid rgba(255,255,255,0.04)" }}
              >
                {[
                  { icon: IconThumbUp, label: "Like" },
                  { icon: IconMessage, label: "Comment" },
                  { icon: IconShare, label: "Share" },
                ].map(({ icon: Icon, label }) => (
                  <Stack key={label} direction="row" sx={{ alignItems: "center", gap: 0.75 }}>
                    <Icon size={15} style={{ color: "rgba(255,255,255,0.3)" }} />
                    <Typography
                      sx={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", fontWeight: 600 }}
                    >
                      {label}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Box>
          )}

          {/* Instagram Preview */}
          {activePlatform === "instagram" && (
            <Box
              sx={{
                borderRadius: 2.5,
                overflow: "hidden",
                bgcolor: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                maxWidth: 420,
              }}
            >
              <Stack direction="row" sx={{ alignItems: "center", gap: 1.5, px: 2, py: 1.5 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #f58529, #dd2a7b, #8134af)",
                    p: "2px",
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      bgcolor: "#0c0c10",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography sx={{ fontWeight: 900, fontSize: "0.55rem", color: "#e4405f" }}>
                      IG
                    </Typography>
                  </Box>
                </Box>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.82rem",
                    color: "rgba(255,255,255,0.9)",
                    flex: 1,
                  }}
                >
                  {toolName || "brand"}
                </Typography>
                <Typography sx={{ fontSize: "1rem", color: "rgba(255,255,255,0.2)" }}>
                  ···
                </Typography>
              </Stack>
              <Box sx={{ width: "100%", aspectRatio: "1 / 1", bgcolor: "rgba(0,0,0,0.4)" }}>
                <MediaElement />
              </Box>
              <Stack direction="row" sx={{ px: 2, py: 1.25, gap: 2 }}>
                {[IconHeart, IconMessage, IconShare].map((Icon, i) => (
                  <Icon
                    key={i}
                    size={22}
                    style={{ color: "rgba(255,255,255,0.7)", cursor: "pointer" }}
                  />
                ))}
              </Stack>
              <Box sx={{ px: 2, pb: 1.5 }}>
                <Typography
                  sx={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.85)", lineHeight: 1.65 }}
                >
                  <strong style={{ fontWeight: 800 }}>{toolName || "brand"}</strong>{" "}
                  {variant.caption || variant.primaryCopy?.slice(0, 120) || ""}
                </Typography>
                {variant.hashtags?.length > 0 && (
                  <Typography
                    sx={{ fontSize: "0.75rem", color: "#60a5fa", mt: 0.5, lineHeight: 1.5 }}
                  >
                    {variant.hashtags.map((h) => `#${h}`).join(" ")}
                  </Typography>
                )}
              </Box>
            </Box>
          )}

          {/* LinkedIn Preview */}
          {activePlatform === "linkedin" && (
            <Box
              sx={{
                borderRadius: 2.5,
                overflow: "hidden",
                bgcolor: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <Stack direction="row" sx={{ alignItems: "center", gap: 1.5, px: 2, py: 1.5 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1.5,
                    bgcolor: "rgba(10,102,194,0.12)",
                    border: "1px solid rgba(10,102,194,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IconBrandLinkedin size={18} style={{ color: "#0a66c2" }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{ fontWeight: 700, fontSize: "0.85rem", color: "rgba(255,255,255,0.9)" }}
                  >
                    {toolName || "Company"}
                  </Typography>
                  <Typography sx={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.35)" }}>
                    Promoted · 1,234 followers
                  </Typography>
                </Box>
              </Stack>
              <Box sx={{ px: 2, pb: 1.5 }}>
                <Typography
                  sx={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.7 }}
                >
                  {variant.primaryCopy?.slice(0, 200) || variant.hook || ""}
                </Typography>
              </Box>
              <Box sx={{ width: "100%", aspectRatio: "1.91 / 1", bgcolor: "rgba(0,0,0,0.4)" }}>
                <MediaElement />
              </Box>
              <Stack
                direction="row"
                sx={{
                  alignItems: "center",
                  justifyContent: "space-between",
                  px: 2,
                  py: 1.5,
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <Typography
                  sx={{ fontWeight: 800, fontSize: "0.85rem", color: "rgba(255,255,255,0.85)" }}
                >
                  {variant.headline || "Headline"}
                </Typography>
                <Button
                  size="small"
                  sx={{
                    px: 2.5,
                    py: 0.75,
                    borderRadius: 6,
                    fontWeight: 700,
                    fontSize: "0.72rem",
                    textTransform: "none",
                    bgcolor: "transparent",
                    color: "#0a66c2",
                    border: "1px solid #0a66c2",
                    "&:hover": { bgcolor: "rgba(10,102,194,0.1)" },
                  }}
                >
                  {variant.cta || "Learn More"}
                </Button>
              </Stack>
            </Box>
          )}
        </motion.div>
      </AnimatePresence>
    </Box>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CREATIVE ENGINE RENDERER — Rich Multi-Model Results
   ═══════════════════════════════════════════════════════════════ */

const QUALITY_TIERS = [
  { label: "Simple", badge: "" },
  { label: "Standard", badge: "" },
  { label: "Premium", badge: "" },
  { label: "A", badge: "A" },
  { label: "AAA+", badge: "AAA+" },
];

function CreativeResults({
  response,
  activeVar,
  setActiveVar,
  tool,
  gateInfo,
  uploadedMedia,
  isAdmin,
}) {
  const d = response?.data || {};
  const variants = d.variants || [];
  const meta = response?.meta || {};
  const isPaid = isAdmin || ["pro", "alltools", "enterprise", "agency"].includes(gateInfo?.tier);
  const hasUpload = uploadedMedia?.url;

  if (!variants.length)
    return <Typography sx={{ color: "text.secondary" }}>No variants generated.</Typography>;

  const sorted = [...variants].sort(
    (a, b) => (a.performanceScore || 0) - (b.performanceScore || 0),
  );

  const bentoSizes = [
    { xs: 12, md: 4 },
    { xs: 12, md: 4 },
    { xs: 12, md: 4 },
    { xs: 12, md: 6 },
    { xs: 12, md: 6 },
  ];

  return (
    <Box>
      {/* ── Overall Score — Dramatic Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 4,
            overflow: "hidden",
            position: "relative",
            background:
              "linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(139,92,246,0.03) 100%)",
            border: "1px solid rgba(99,102,241,0.12)",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              background: "linear-gradient(90deg, #6366f1, #a855f7, #6366f1)",
              opacity: 0.6,
            },
          }}
        >
          <Stack direction="row" sx={{ alignItems: "center", gap: 3, flexWrap: "wrap" }}>
            <ScoreGauge score={d.overallScore} size={74} showLabel label="Score" />
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Stack direction="row" sx={{ alignItems: "baseline", gap: 1, mb: 0.75 }}>
                <Typography
                  sx={{
                    fontWeight: 900,
                    fontSize: "1.8rem",
                    color: "rgba(255,255,255,0.9)",
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                  }}
                >
                  {d.overallScore || 0}
                </Typography>
                <Typography
                  sx={{ fontSize: "0.85rem", fontWeight: 500, color: "rgba(255,255,255,0.3)" }}
                >
                  /100
                </Typography>
                <Chip
                  label={
                    d.overallScore >= 80
                      ? "Excellent"
                      : d.overallScore >= 60
                        ? "Good"
                        : "Needs Work"
                  }
                  size="small"
                  sx={{
                    ml: 1,
                    height: 22,
                    fontSize: "0.6rem",
                    fontWeight: 800,
                    bgcolor:
                      d.overallScore >= 80
                        ? "rgba(16,185,129,0.1)"
                        : d.overallScore >= 60
                          ? "rgba(245,158,11,0.1)"
                          : "rgba(239,68,68,0.1)",
                    color:
                      d.overallScore >= 80
                        ? "#34d399"
                        : d.overallScore >= 60
                          ? "#fbbf24"
                          : "#f87171",
                    border: `1px solid ${d.overallScore >= 80 ? "rgba(16,185,129,0.2)" : d.overallScore >= 60 ? "rgba(245,158,11,0.2)" : "rgba(239,68,68,0.2)"}`,
                  }}
                />
              </Stack>
              <Typography
                sx={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}
              >
                {d.recommendation || ""}
              </Typography>
            </Box>
            {d.expectedImpact && (
              <Stack spacing={0.75}>
                <Chip
                  icon={<IconTrendingUp size={13} />}
                  label={`Traffic ${d.expectedImpact.trafficLift || ""}`}
                  size="small"
                  sx={{
                    bgcolor: "rgba(16,185,129,0.06)",
                    color: "#34d399",
                    border: "1px solid rgba(16,185,129,0.15)",
                    fontWeight: 700,
                    fontSize: "0.68rem",
                  }}
                />
                <Chip
                  icon={<IconTarget size={13} />}
                  label={`Conv ${d.expectedImpact.conversionLift || ""}`}
                  size="small"
                  sx={{
                    bgcolor: "rgba(139,92,246,0.06)",
                    color: "#a78bfa",
                    border: "1px solid rgba(139,92,246,0.15)",
                    fontWeight: 700,
                    fontSize: "0.68rem",
                  }}
                />
              </Stack>
            )}
          </Stack>
        </Box>
      </motion.div>

      {/* ── Variant Bento Grid (5 cards) ── */}
      <Grid container spacing={1.5} sx={{ mb: 3 }}>
        {sorted.slice(0, 5).map((v, i) => {
          const tier = QUALITY_TIERS[i] || QUALITY_TIERS[0];
          const tab = getAngleTab(v.angle);
          const TabIcon = tab.icon;
          const isSelected = activeVar === i;
          const isLocked = !isPaid && i >= 3;
          const isBest = i === 4;

          return (
            <Grid size={bentoSizes[i] || { xs: 12, md: 4 }} key={i}>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <Box
                  onClick={() => {
                    if (!isLocked) setActiveVar(i);
                  }}
                  sx={{
                    position: "relative",
                    overflow: "hidden",
                    cursor: isLocked ? "default" : "pointer",
                    borderRadius: 3,
                    height: i < 3 ? 240 : 200,
                    border: isSelected
                      ? "1px solid rgba(99,102,241,0.4)"
                      : "1px solid rgba(255,255,255,0.06)",
                    transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                    boxShadow: isSelected ? "0 0 20px -4px rgba(99,102,241,0.2)" : "none",
                    "&:hover": isLocked
                      ? {}
                      : {
                          borderColor: "rgba(99,102,241,0.25)",
                          transform: "translateY(-4px)",
                          boxShadow: "0 12px 40px -8px rgba(0,0,0,0.6)",
                        },
                  }}
                >
                  {(() => {
                    const imgSrc = sanitizeMediaUrl(hasUpload ? uploadedMedia.url : v.image_url);
                    const isVid = hasUpload && uploadedMedia.type === "video";
                    if (isVid)
                      return (
                        <video
                          src={sanitizeMediaUrl(uploadedMedia.url)}
                          muted
                          loop
                          autoPlay
                          playsInline
                          style={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            filter: isLocked ? "blur(8px) brightness(0.3)" : "brightness(0.4)",
                          }}
                        />
                      );
                    if (imgSrc)
                      return (
                        <Box
                          component="img"
                          src={imgSrc}
                          alt=""
                          sx={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            filter: isLocked ? "blur(8px) brightness(0.3)" : "brightness(0.4)",
                            transition: "filter 0.3s",
                          }}
                        />
                      );
                    return (
                      <Box
                        sx={{
                          position: "absolute",
                          inset: 0,
                          background: isSelected
                            ? "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.04))"
                            : "linear-gradient(135deg, rgba(255,255,255,0.03), rgba(0,0,0,0.3))",
                        }}
                      />
                    );
                  })()}
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.15) 45%, rgba(0,0,0,0.35) 100%)",
                    }}
                  />
                  {isSelected && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 2,
                        background: "linear-gradient(90deg, #6366f1, #a855f7)",
                        zIndex: 2,
                      }}
                    />
                  )}

                  <Box sx={{ position: "absolute", top: 12, left: 12, zIndex: 2 }}>
                    <Chip
                      icon={<TabIcon size={12} />}
                      label={tier.label}
                      size="small"
                      sx={{
                        height: 24,
                        fontSize: "0.62rem",
                        fontWeight: 700,
                        bgcolor: "rgba(0,0,0,0.55)",
                        backdropFilter: "blur(12px)",
                        color: "rgba(255,255,255,0.8)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        "& .MuiChip-icon": { color: "rgba(255,255,255,0.65)" },
                      }}
                    />
                    {isBest && (
                      <Chip
                        label="BEST"
                        size="small"
                        icon={<IconStar size={10} />}
                        sx={{
                          ml: 0.5,
                          height: 20,
                          fontSize: "0.55rem",
                          fontWeight: 900,
                          bgcolor: "rgba(251,191,36,0.15)",
                          color: "#fbbf24",
                          border: "1px solid rgba(251,191,36,0.25)",
                          "& .MuiChip-icon": { color: "#fbbf24" },
                        }}
                      />
                    )}
                  </Box>

                  <Box
                    sx={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      zIndex: 2,
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      bgcolor: "rgba(0,0,0,0.55)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      sx={{ fontWeight: 900, fontSize: "0.78rem", color: "rgba(255,255,255,0.9)" }}
                    >
                      {v.performanceScore || 0}
                    </Typography>
                  </Box>

                  {!isLocked && (
                    <Box
                      sx={{ position: "absolute", bottom: 0, left: 0, right: 0, p: 2, zIndex: 2 }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 800,
                          fontSize: i < 3 ? "1.05rem" : "0.92rem",
                          color: "rgba(255,255,255,0.95)",
                          letterSpacing: "-0.02em",
                          lineHeight: 1.25,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textShadow: "0 2px 12px rgba(0,0,0,0.7)",
                        }}
                      >
                        {v.headline || `Variant ${i + 1}`}
                      </Typography>
                      {v.hook && (
                        <Typography
                          sx={{
                            fontSize: "0.72rem",
                            color: "rgba(255,255,255,0.55)",
                            mt: 0.5,
                            lineHeight: 1.4,
                            display: "-webkit-box",
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {v.hook}
                        </Typography>
                      )}
                      {v.cta && (
                        <Chip
                          label={v.cta}
                          size="small"
                          sx={{
                            mt: 1,
                            height: 22,
                            fontSize: "0.6rem",
                            fontWeight: 700,
                            bgcolor: "rgba(99,102,241,0.2)",
                            color: "#a5b4fc",
                            border: "1px solid rgba(99,102,241,0.3)",
                          }}
                        />
                      )}
                    </Box>
                  )}

                  {isLocked && (
                    <Box
                      onClick={() => (window.location.href = "/pricing")}
                      sx={{
                        position: "absolute",
                        inset: 0,
                        zIndex: 3,
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "rgba(0,0,0,0.35)",
                        backdropFilter: "blur(3px)",
                      }}
                    >
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: "50%",
                          mb: 1.5,
                          bgcolor: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <IconLock size={22} style={{ color: "rgba(255,255,255,0.5)" }} />
                      </Box>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: "0.85rem",
                          color: "rgba(255,255,255,0.75)",
                        }}
                      >
                        Upgrade to Pro
                      </Typography>
                      <Typography sx={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.35)" }}>
                        Unlock premium variants
                      </Typography>
                    </Box>
                  )}
                </Box>
              </motion.div>
            </Grid>
          );
        })}
      </Grid>

      {/* ── Expanded Variant Detail ── */}
      <AnimatePresence mode="wait">
        {sorted[activeVar] &&
          (() => {
            const activeDetail = sorted[activeVar];
            const activeTier = QUALITY_TIERS[activeVar] || QUALITY_TIERS[0];

            return (
              <motion.div
                key={activeVar}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
              >
                <Box
                  sx={{
                    borderRadius: 4,
                    overflow: "hidden",
                    bgcolor: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  {/* Tier Header */}
                  <Stack
                    direction="row"
                    sx={{
                      alignItems: "center",
                      justifyContent: "space-between",
                      px: 3,
                      pt: 2.5,
                      pb: 1.5,
                    }}
                  >
                    <Stack direction="row" sx={{ alignItems: "center", gap: 1.5 }}>
                      <Chip
                        label={activeTier.label}
                        size="small"
                        sx={{
                          height: 24,
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          bgcolor: "rgba(255,255,255,0.06)",
                          color: "rgba(255,255,255,0.6)",
                          border: "1px solid rgba(255,255,255,0.1)",
                        }}
                      />
                      <Typography sx={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)" }}>
                        {activeDetail.angle} Angle
                      </Typography>
                      {activeDetail.targetAudience && (
                        <Chip
                          label={activeDetail.targetAudience}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: "0.55rem",
                            fontWeight: 600,
                            bgcolor: "rgba(255,255,255,0.03)",
                            color: "rgba(255,255,255,0.35)",
                            border: "1px solid rgba(255,255,255,0.06)",
                          }}
                        />
                      )}
                    </Stack>
                    <ScoreGauge score={activeDetail.performanceScore} size={48} />
                  </Stack>

                  {/* ── Multi-Platform Ad Previews ── */}
                  <Box sx={{ px: 3, pb: 2.5 }}>
                    <PlatformPreviews
                      variant={activeDetail}
                      toolName={tool.name}
                      uploadedMedia={uploadedMedia}
                    />
                  </Box>

                  {/* ── Full Content + Metrics — 2 columns ── */}
                  <Grid
                    container
                    spacing={0}
                    sx={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <Grid size={{ xs: 12, lg: 7 }}>
                      <Box sx={{ p: 3 }}>
                        {/* Primary Copy */}
                        {activeDetail.primaryCopy && (
                          <Box
                            sx={{
                              p: 3,
                              borderRadius: 3,
                              mb: 2.5,
                              position: "relative",
                              overflow: "hidden",
                              bgcolor: "rgba(255,255,255,0.02)",
                              border: "1px solid rgba(255,255,255,0.06)",
                              maxHeight: 360,
                              overflowY: "auto",
                              "&::-webkit-scrollbar": { width: 4 },
                              "&::-webkit-scrollbar-thumb": {
                                bgcolor: "rgba(255,255,255,0.08)",
                                borderRadius: 4,
                              },
                              "&::before": {
                                content: '""',
                                position: "absolute",
                                top: 0,
                                left: 0,
                                bottom: 0,
                                width: 3,
                                background: "linear-gradient(180deg, #6366f1, #a855f7)",
                                borderRadius: "3px 0 0 3px",
                              },
                            }}
                          >
                            <RichText content={activeDetail.primaryCopy} accentColor="#a5b4fc" />
                          </Box>
                        )}

                        {/* Hashtags */}
                        {activeDetail.hashtags?.length > 0 && (
                          <Stack direction="row" sx={{ gap: 0.75, mb: 2.5, flexWrap: "wrap" }}>
                            {activeDetail.hashtags.map((h, i) => (
                              <Chip
                                key={i}
                                label={`#${h}`}
                                size="small"
                                sx={{
                                  height: 24,
                                  fontSize: "0.65rem",
                                  fontWeight: 600,
                                  bgcolor: "rgba(96,165,250,0.06)",
                                  color: "#60a5fa",
                                  border: "1px solid rgba(96,165,250,0.12)",
                                }}
                              />
                            ))}
                          </Stack>
                        )}

                        {/* Targeting */}
                        {activeDetail.targeting && typeof activeDetail.targeting === "object" && (
                          <Box
                            sx={{
                              p: 2.5,
                              borderRadius: 3,
                              bgcolor: "rgba(255,255,255,0.02)",
                              border: "1px solid rgba(255,255,255,0.06)",
                            }}
                          >
                            <Stack direction="row" sx={{ alignItems: "center", gap: 1, mb: 1.5 }}>
                              <IconTarget size={14} style={{ color: "#a78bfa" }} />
                              <Typography
                                sx={{ fontWeight: 700, fontSize: "0.82rem", color: "#a78bfa" }}
                              >
                                Targeting
                              </Typography>
                            </Stack>
                            <Grid container spacing={1.5}>
                              {Object.entries(activeDetail.targeting).map(([k, val]) => (
                                <Grid size={{ xs: 6 }} key={k}>
                                  <Typography
                                    sx={{
                                      fontSize: "0.6rem",
                                      color: "rgba(255,255,255,0.25)",
                                      textTransform: "uppercase",
                                      letterSpacing: "0.06em",
                                      fontWeight: 700,
                                    }}
                                  >
                                    {k.replace(/_/g, " ")}
                                  </Typography>
                                  <Typography
                                    sx={{
                                      fontSize: "0.82rem",
                                      fontWeight: 600,
                                      color: "rgba(255,255,255,0.65)",
                                      mt: 0.25,
                                    }}
                                  >
                                    {val}
                                  </Typography>
                                </Grid>
                              ))}
                            </Grid>
                          </Box>
                        )}

                        {/* Visual Guide */}
                        {activeDetail.visualGuide &&
                          typeof activeDetail.visualGuide === "object" && (
                            <Box
                              sx={{
                                p: 2.5,
                                mt: 2,
                                borderRadius: 3,
                                bgcolor: "rgba(251,146,60,0.03)",
                                border: "1px solid rgba(251,146,60,0.08)",
                              }}
                            >
                              <Stack direction="row" sx={{ alignItems: "center", gap: 1, mb: 1.5 }}>
                                <IconPalette size={14} style={{ color: "#fb923c" }} />
                                <Typography
                                  sx={{ fontWeight: 700, fontSize: "0.82rem", color: "#fb923c" }}
                                >
                                  Visual Guide
                                </Typography>
                              </Stack>
                              <Grid container spacing={1.5}>
                                {Object.entries(activeDetail.visualGuide).map(([k, val]) => (
                                  <Grid size={{ xs: 12, sm: 4 }} key={k}>
                                    <Typography
                                      sx={{
                                        fontSize: "0.6rem",
                                        color: "rgba(255,255,255,0.25)",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.06em",
                                        fontWeight: 700,
                                      }}
                                    >
                                      {k}
                                    </Typography>
                                    <Typography
                                      sx={{
                                        fontSize: "0.78rem",
                                        fontWeight: 600,
                                        color: "rgba(255,255,255,0.55)",
                                        mt: 0.25,
                                      }}
                                    >
                                      {val}
                                    </Typography>
                                  </Grid>
                                ))}
                              </Grid>
                            </Box>
                          )}
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, lg: 5 }}>
                      <Box sx={{ p: 3, borderLeft: { lg: "1px solid rgba(255,255,255,0.06)" } }}>
                        <Typography
                          sx={{
                            fontSize: "0.6rem",
                            fontWeight: 700,
                            color: "rgba(255,255,255,0.25)",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            mb: 2,
                          }}
                        >
                          Performance Breakdown
                        </Typography>
                        <MetricBar
                          label="Overall Score"
                          value={activeDetail.performanceScore || 0}
                          max={100}
                          delay={0}
                        />
                        <MetricBar
                          label="Predicted CTR"
                          value={activeDetail.predictedCTR || 0}
                          max={8}
                          suffix="%"
                          delay={0.05}
                        />
                        <MetricBar
                          label="Conversion Rate"
                          value={activeDetail.predictedConversionRate || 0}
                          max={5}
                          suffix="%"
                          delay={0.1}
                        />
                        <MetricBar
                          label="Engagement"
                          value={activeDetail.engagementScore || 0}
                          max={100}
                          delay={0.15}
                        />
                        <MetricBar
                          label="Clarity"
                          value={activeDetail.clarityScore || 0}
                          max={100}
                          delay={0.2}
                        />

                        {/* Image Analysis (Qwen3-VL) */}
                        {activeDetail.imageAnalysis &&
                          typeof activeDetail.imageAnalysis === "object" &&
                          !activeDetail.imageAnalysis.raw && (
                            <Box
                              sx={{
                                mt: 2,
                                p: 2,
                                borderRadius: 2.5,
                                bgcolor: "rgba(244,114,182,0.04)",
                                border: "1px solid rgba(244,114,182,0.1)",
                              }}
                            >
                              <Stack direction="row" sx={{ alignItems: "center", gap: 1, mb: 1.5 }}>
                                <IconScan size={13} style={{ color: "#f472b6" }} />
                                <Typography
                                  sx={{
                                    fontSize: "0.6rem",
                                    fontWeight: 700,
                                    color: "rgba(255,255,255,0.25)",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.08em",
                                  }}
                                >
                                  AI Image Analysis
                                </Typography>
                              </Stack>
                              <Grid container spacing={1}>
                                {[
                                  {
                                    label: "Visual Impact",
                                    value: activeDetail.imageAnalysis.visualImpact,
                                    color: "#f472b6",
                                  },
                                  {
                                    label: "Brand Fit",
                                    value: activeDetail.imageAnalysis.brandAlignment,
                                    color: "#a78bfa",
                                  },
                                  {
                                    label: "Commercial",
                                    value: activeDetail.imageAnalysis.commercialAppeal,
                                    color: "#fbbf24",
                                  },
                                  {
                                    label: "Composition",
                                    value: activeDetail.imageAnalysis.composition,
                                    color: "#34d399",
                                  },
                                ].map(({ label, value, color }) => (
                                  <Grid size={{ xs: 3 }} key={label}>
                                    <Box sx={{ textAlign: "center" }}>
                                      <Typography
                                        sx={{
                                          fontSize: "1rem",
                                          fontWeight: 900,
                                          color,
                                          lineHeight: 1,
                                        }}
                                      >
                                        {value || "—"}
                                      </Typography>
                                      <Typography
                                        sx={{
                                          fontSize: "0.52rem",
                                          fontWeight: 700,
                                          color: "rgba(255,255,255,0.25)",
                                          textTransform: "uppercase",
                                          mt: 0.25,
                                        }}
                                      >
                                        {label}
                                      </Typography>
                                    </Box>
                                  </Grid>
                                ))}
                              </Grid>
                              {activeDetail.imageAnalysis.suggestion && (
                                <Typography
                                  sx={{
                                    fontSize: "0.68rem",
                                    color: "rgba(255,255,255,0.4)",
                                    mt: 1,
                                    fontStyle: "italic",
                                    borderTop: "1px solid rgba(255,255,255,0.04)",
                                    pt: 1,
                                  }}
                                >
                                  {activeDetail.imageAnalysis.suggestion}
                                </Typography>
                              )}
                            </Box>
                          )}

                        {/* Funnel stage */}
                        {activeDetail.funnelStage && (
                          <Box
                            sx={{
                              mt: 2,
                              p: 2,
                              borderRadius: 2.5,
                              bgcolor: "rgba(255,255,255,0.02)",
                              border: "1px solid rgba(255,255,255,0.06)",
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: "0.6rem",
                                fontWeight: 700,
                                color: "rgba(255,255,255,0.25)",
                                textTransform: "uppercase",
                                letterSpacing: "0.08em",
                                mb: 0.75,
                              }}
                            >
                              Funnel Stage
                            </Typography>
                            <Stack direction="row" sx={{ gap: 0.5 }}>
                              {["TOFU", "MOFU", "BOFU"].map((stage) => (
                                <Box
                                  key={stage}
                                  sx={{
                                    flex: 1,
                                    py: 0.75,
                                    borderRadius: 1.5,
                                    textAlign: "center",
                                    bgcolor:
                                      activeDetail.funnelStage === stage
                                        ? "rgba(99,102,241,0.12)"
                                        : "rgba(255,255,255,0.02)",
                                    border: `1px solid ${activeDetail.funnelStage === stage ? "rgba(99,102,241,0.25)" : "rgba(255,255,255,0.04)"}`,
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      fontSize: "0.6rem",
                                      fontWeight: 800,
                                      color:
                                        activeDetail.funnelStage === stage
                                          ? "#a5b4fc"
                                          : "rgba(255,255,255,0.2)",
                                    }}
                                  >
                                    {stage}
                                  </Typography>
                                </Box>
                              ))}
                            </Stack>
                          </Box>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </motion.div>
            );
          })()}
      </AnimatePresence>

      {/* ── Market Intelligence (Gemini Benchmarks) ── */}
      <Box sx={{ mt: 3 }}>
        <BenchmarksSection benchmarks={d.benchmarks} />
      </Box>
    </Box>
  );
}

/* ═══════════════════════════════════════════════════════════════
   AUTOMATION ENGINE RENDERER
   ═══════════════════════════════════════════════════════════════ */

function AutomationResults({ response }) {
  const d = response?.data || {};
  const meta = response?.meta || {};
  const accent = "#8b5cf6";
  const sevColor =
    d.diagnosis?.severity === "High" || d.diagnosis?.severity === "Critical"
      ? "#ef4444"
      : d.diagnosis?.severity === "Medium"
        ? "#f59e0b"
        : "#10b981";
  const statusColor =
    d.healthStatus === "Critical"
      ? "#ef4444"
      : d.healthStatus === "Needs Optimization"
        ? "#f59e0b"
        : "#10b981";

  return (
    <Box>
      {/* ── Social Scheduler Special View (Post Scheduler Slug) ── */}
      {meta.slug === "post-scheduler" && d.scheduleGrid && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ mb: 4 }}>
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", alignItems: "center", mb: 2 }}
            >
              <Typography
                sx={{
                  fontSize: "0.65rem",
                  fontWeight: 800,
                  color: "rgba(255,255,255,0.3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                }}
              >
                AI-Powered Optimal Schedule
              </Typography>
              <Stack direction="row" spacing={1}>
                <Chip
                  icon={<IconCheck size={12} color="#10b981" />}
                  label="Image (DALL-E 3)"
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: "0.6rem",
                    bgcolor: "rgba(16,185,129,0.06)",
                    color: "#10b981",
                    border: "1px solid rgba(16,185,129,0.1)",
                  }}
                />
                <Chip
                  icon={<IconCheck size={12} color="#10b981" />}
                  label="Video (FAL.ai)"
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: "0.6rem",
                    bgcolor: "rgba(16,185,129,0.06)",
                    color: "#10b981",
                    border: "1px solid rgba(16,185,129,0.1)",
                  }}
                />
              </Stack>
            </Stack>
            <Grid container spacing={1.5}>
              {d.scheduleGrid.map((day, idx) => (
                <Grid size={{ xs: 6, sm: 4, md: 1.7 }} key={idx}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2.5,
                      textAlign: "center",
                      bgcolor: day.isOptimal ? `${accent}15` : "rgba(255,255,255,0.02)",
                      border: `1px solid ${day.isOptimal ? `${accent}30` : "rgba(255,255,255,0.06)"}`,
                      boxShadow: day.isOptimal ? `0 0 15px ${accent}15` : "none",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.65rem",
                        fontWeight: 800,
                        color: day.isOptimal ? accent : "rgba(255,255,255,0.3)",
                      }}
                    >
                      {day.day}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.9rem",
                        fontWeight: 900,
                        color: day.isOptimal ? "#fff" : "rgba(255,255,255,0.5)",
                        mt: 0.5,
                      }}
                    >
                      {day.time}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.55rem",
                        fontWeight: 700,
                        color: "rgba(255,255,255,0.2)",
                        mt: 0.25,
                      }}
                    >
                      Score: {day.score}/100
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Post Previews */}
          {d.platforms?.map((platform, pIdx) => (
            <Box key={pIdx} sx={{ mb: 3 }}>
              <MainCard
                sx={{ bgcolor: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.04)" }}
              >
                <Stack direction="row" sx={{ alignItems: "center", gap: 1.5, mb: 2 }}>
                  <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: "rgba(255,255,255,0.03)" }}>
                    {platform.name === "Instagram" ? (
                      <IconBrandInstagram size={18} color="#E4405F" />
                    ) : (
                      <IconBrandFacebook size={18} color="#1877F2" />
                    )}
                  </Box>
                  <Typography sx={{ fontWeight: 800, fontSize: "0.9rem" }}>
                    {platform.name} Preview
                  </Typography>
                </Stack>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <RichText content={platform.content} accentColor={accent} />
                  {sanitizeMediaUrl(platform.imageUrl) && !sanitizeMediaUrl(platform.videoUrl) && (
                    <Box
                      sx={{
                        mt: 2,
                        borderRadius: 2,
                        overflow: "hidden",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <img
                        src={sanitizeMediaUrl(platform.imageUrl)}
                        alt="Post preview"
                        style={{ width: "100%", height: "auto", display: "block" }}
                      />
                    </Box>
                  )}
                  {sanitizeMediaUrl(platform.videoUrl) && (
                    <Box
                      sx={{
                        mt: 2,
                        borderRadius: 2,
                        overflow: "hidden",
                        border: "1px solid rgba(255,255,255,0.08)",
                        bgcolor: "#000",
                        aspectRatio: "16/9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <video
                        src={sanitizeMediaUrl(platform.videoUrl)}
                        controls
                        poster={sanitizeMediaUrl(platform.imageUrl)}
                        style={{ width: "100%", height: "100%", objectFit: "contain" }}
                      />
                    </Box>
                  )}
                </Box>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2, bgcolor: accent, borderRadius: 2, fontWeight: 800 }}
                  startIcon={<IconClock size={18} />}
                >
                  Confirm & Schedule for {platform.scheduledTime}
                </Button>
              </MainCard>
            </Box>
          ))}
        </motion.div>
      )}

      {/* Score + Status — dramatic header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 4,
            position: "relative",
            overflow: "hidden",
            background: `linear-gradient(135deg, ${accent}0a, rgba(0,0,0,0.25))`,
            border: `1px solid ${accent}15`,
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              background: `linear-gradient(90deg, ${accent}, ${statusColor})`,
              opacity: 0.7,
            },
          }}
        >
          <Stack direction="row" sx={{ alignItems: "center", gap: 3, flexWrap: "wrap" }}>
            <ScoreGauge score={d.overallScore} size={68} showLabel label="Auto" />
            <Box sx={{ flex: 1 }}>
              <Stack direction="row" sx={{ alignItems: "center", gap: 1, mb: 0.75 }}>
                <Typography
                  sx={{
                    fontWeight: 900,
                    fontSize: "1.6rem",
                    color: "#f1f5f9",
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                  }}
                >
                  {d.overallScore || 0}
                </Typography>
                <Typography
                  sx={{ fontSize: "0.8rem", fontWeight: 500, color: "rgba(255,255,255,0.3)" }}
                >
                  /100
                </Typography>
                <Chip
                  label={d.healthStatus || "Unknown"}
                  size="small"
                  sx={{
                    bgcolor: `${statusColor}12`,
                    color: statusColor,
                    fontWeight: 800,
                    fontSize: "0.62rem",
                    height: 22,
                    border: `1px solid ${statusColor}20`,
                    ml: 0.5,
                    ...(d.healthStatus === "Critical" && {
                      animation: "severityPulse 2s ease-in-out infinite",
                      "@keyframes severityPulse": {
                        "0%,100%": { boxShadow: "none" },
                        "50%": { boxShadow: `0 0 12px ${statusColor}30` },
                      },
                    }),
                  }}
                />
              </Stack>
              <Typography
                sx={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.55 }}
              >
                {d.recommendation || ""}
              </Typography>
            </Box>
            <Box sx={{ textAlign: "right" }}>
              <Typography
                sx={{
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.25)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                Confidence
              </Typography>
              <Typography
                sx={{
                  fontSize: "1.1rem",
                  fontWeight: 900,
                  color: accent,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {d.confidenceScore || 0}%
              </Typography>
            </Box>
          </Stack>
        </Box>
      </motion.div>

      {/* Diagnosis — alert card */}
      {d.diagnosis && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Box
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
              position: "relative",
              overflow: "hidden",
              bgcolor: `${sevColor}06`,
              border: `1px solid ${sevColor}15`,
              "&::before": {
                content: '""',
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: 4,
                background: `linear-gradient(180deg, ${sevColor}, ${sevColor}60)`,
                borderRadius: "3px 0 0 3px",
              },
            }}
          >
            <Stack direction="row" sx={{ alignItems: "center", gap: 1, mb: 1.5 }}>
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: `${sevColor}15`,
                  border: `1px solid ${sevColor}20`,
                }}
              >
                <IconAlertTriangle size={14} style={{ color: sevColor }} />
              </Box>
              <Typography sx={{ fontWeight: 900, fontSize: "0.9rem", color: sevColor }}>
                Diagnosis
              </Typography>
              <Chip
                label={d.diagnosis.severity}
                size="small"
                sx={{
                  height: 20,
                  fontSize: "0.58rem",
                  fontWeight: 800,
                  bgcolor: `${sevColor}10`,
                  color: sevColor,
                  border: `1px solid ${sevColor}18`,
                }}
              />
            </Stack>
            <Typography sx={{ fontWeight: 800, fontSize: "0.95rem", mb: 0.75, color: "#f1f5f9" }}>
              {d.diagnosis.primaryIssue}
            </Typography>
            <Typography
              sx={{
                fontSize: "0.82rem",
                color: "rgba(255,255,255,0.5)",
                mb: 1.5,
                lineHeight: 1.65,
              }}
            >
              {d.diagnosis.details}
            </Typography>
            <Chip
              label={`Est. Waste: $${d.diagnosis.estimatedMonthlyWaste || 0}/mo`}
              size="small"
              sx={{
                bgcolor: "rgba(239,68,68,0.08)",
                color: "#f87171",
                fontWeight: 800,
                fontSize: "0.7rem",
                border: "1px solid rgba(239,68,68,0.12)",
              }}
            />
          </Box>
        </motion.div>
      )}

      {/* Actions — timeline layout */}
      {d.actionsGenerated?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <Box sx={{ mb: 3 }}>
            <Typography
              sx={{
                fontSize: "0.6rem",
                fontWeight: 700,
                color: "rgba(255,255,255,0.25)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                mb: 2,
              }}
            >
              Actions ({d.actionsGenerated.length})
            </Typography>
            <Box sx={{ position: "relative", pl: 3 }}>
              {/* Timeline line */}
              <Box
                sx={{
                  position: "absolute",
                  left: 10,
                  top: 14,
                  bottom: 14,
                  width: 2,
                  background: `linear-gradient(180deg, ${accent}, ${accent}30)`,
                  borderRadius: 1,
                }}
              />
              <Stack spacing={2}>
                {d.actionsGenerated.map((a, i) => {
                  const riskColor =
                    a.riskLevel === "Low"
                      ? "#10b981"
                      : a.riskLevel === "Medium"
                        ? "#f59e0b"
                        : "#ef4444";
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
                    >
                      <Box sx={{ position: "relative" }}>
                        {/* Timeline dot */}
                        <Box
                          sx={{
                            position: "absolute",
                            left: -25,
                            top: 18,
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            bgcolor: `${accent}20`,
                            border: `2px solid ${accent}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: `0 0 10px ${accent}25`,
                            zIndex: 1,
                          }}
                        >
                          <Typography sx={{ fontSize: "0.55rem", fontWeight: 900, color: accent }}>
                            {i + 1}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            p: 2.5,
                            borderRadius: 3,
                            bgcolor: "rgba(255,255,255,0.02)",
                            border: `1px solid ${G.border}`,
                            transition: "all 0.25s ease",
                            "&:hover": {
                              bgcolor: "rgba(255,255,255,0.035)",
                              borderColor: `${accent}20`,
                              transform: "translateX(4px)",
                            },
                          }}
                        >
                          <Stack
                            direction="row"
                            sx={{ alignItems: "center", justifyContent: "space-between", mb: 1 }}
                          >
                            <Typography
                              sx={{ fontWeight: 800, fontSize: "0.85rem", color: accent }}
                            >
                              {a.type}
                            </Typography>
                            <Stack direction="row" sx={{ gap: 0.75 }}>
                              <Chip
                                label={`P${a.priority || i + 1}`}
                                size="small"
                                sx={{
                                  height: 20,
                                  fontSize: "0.58rem",
                                  fontWeight: 900,
                                  bgcolor: `${accent}10`,
                                  color: accent,
                                  border: `1px solid ${accent}18`,
                                }}
                              />
                              <Chip
                                label={a.riskLevel}
                                size="small"
                                sx={{
                                  height: 20,
                                  fontSize: "0.58rem",
                                  fontWeight: 700,
                                  bgcolor: `${riskColor}10`,
                                  color: riskColor,
                                  border: `1px solid ${riskColor}18`,
                                }}
                              />
                            </Stack>
                          </Stack>
                          <Typography
                            sx={{
                              fontSize: "0.82rem",
                              color: "rgba(255,255,255,0.65)",
                              fontFamily: '"SF Mono", "Fira Code", monospace',
                              mb: 0.75,
                              lineHeight: 1.5,
                            }}
                          >
                            {a.rule}
                          </Typography>
                          <Typography sx={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)" }}>
                            Expected: {a.expectedImpact}
                          </Typography>
                        </Box>
                      </Box>
                    </motion.div>
                  );
                })}
              </Stack>
            </Box>
          </Box>
        </motion.div>
      )}

      {/* Budget Reallocation — flow arrows */}
      {d.budgetReallocation?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <Box sx={{ mb: 3 }}>
            <Typography
              sx={{
                fontSize: "0.6rem",
                fontWeight: 700,
                color: "rgba(255,255,255,0.25)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                mb: 2,
              }}
            >
              Budget Reallocation
            </Typography>
            <Stack spacing={1.5}>
              {d.budgetReallocation.map((b, i) => (
                <Box
                  key={i}
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    bgcolor: "rgba(255,255,255,0.02)",
                    border: `1px solid ${G.border}`,
                    transition: "all 0.25s ease",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.035)" },
                  }}
                >
                  <Stack direction="row" sx={{ alignItems: "center", gap: 1.5 }}>
                    <Box
                      sx={{
                        flex: 1,
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: "rgba(239,68,68,0.06)",
                        border: "1px solid rgba(239,68,68,0.12)",
                        textAlign: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "0.6rem",
                          fontWeight: 700,
                          color: "rgba(255,255,255,0.3)",
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                        }}
                      >
                        From
                      </Typography>
                      <Typography
                        sx={{ fontSize: "0.82rem", fontWeight: 700, color: "#f87171", mt: 0.25 }}
                      >
                        {b.from}
                      </Typography>
                    </Box>
                    <Stack sx={{ alignItems: "center", gap: 0.25 }}>
                      <IconArrowRight size={16} style={{ color: accent }} />
                      <Typography sx={{ fontSize: "0.85rem", fontWeight: 900, color: "#f59e0b" }}>
                        ${b.amount}
                      </Typography>
                    </Stack>
                    <Box
                      sx={{
                        flex: 1,
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: "rgba(16,185,129,0.06)",
                        border: "1px solid rgba(16,185,129,0.12)",
                        textAlign: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "0.6rem",
                          fontWeight: 700,
                          color: "rgba(255,255,255,0.3)",
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                        }}
                      >
                        To
                      </Typography>
                      <Typography
                        sx={{ fontSize: "0.82rem", fontWeight: 700, color: "#34d399", mt: 0.25 }}
                      >
                        {b.to}
                      </Typography>
                    </Box>
                  </Stack>
                  <Typography
                    sx={{
                      fontSize: "0.72rem",
                      color: "rgba(255,255,255,0.35)",
                      mt: 1,
                      textAlign: "center",
                    }}
                  >
                    {b.reason}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </motion.div>
      )}

      {/* Projected Outcome — green metrics strip */}
      {d.projectedOutcome && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Box
            sx={{
              p: 3,
              borderRadius: 3,
              position: "relative",
              overflow: "hidden",
              background: "linear-gradient(135deg, rgba(16,185,129,0.06), rgba(0,0,0,0.15))",
              border: "1px solid rgba(16,185,129,0.12)",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 2,
                background: "linear-gradient(90deg, #10b981, #06b6d4)",
                opacity: 0.6,
              },
            }}
          >
            <Stack direction="row" sx={{ alignItems: "center", gap: 1, mb: 2 }}>
              <IconTrendingUp size={16} style={{ color: "#10b981" }} />
              <Typography sx={{ fontWeight: 800, fontSize: "0.9rem", color: "#10b981" }}>
                Projected Outcome
              </Typography>
            </Stack>
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 3 }}>
                <MetricCard label="New ROAS" value={d.projectedOutcome.newROAS || "—"} />
              </Grid>
              <Grid size={{ xs: 3 }}>
                <MetricCard label="Cost Saved" value={d.projectedOutcome.costReduction || "—"} />
              </Grid>
              <Grid size={{ xs: 3 }}>
                <MetricCard label="Revenue Up" value={d.projectedOutcome.revenueIncrease || "—"} />
              </Grid>
              <Grid size={{ xs: 3 }}>
                <MetricCard label="Timeline" value={d.projectedOutcome.timeToImpact || "—"} />
              </Grid>
            </Grid>
          </Box>
        </motion.div>
      )}

      {/* ── Suggested Ad Copy (Claude Creative) ── */}
      {d.suggestedCopy && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <Box
            sx={{
              p: 3,
              mt: 3,
              borderRadius: 3,
              bgcolor: "rgba(192,132,252,0.04)",
              border: "1px solid rgba(192,132,252,0.1)",
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: 3,
                background: "linear-gradient(180deg, #c084fc, #a855f7)",
                borderRadius: "3px 0 0 3px",
              },
            }}
          >
            <Stack direction="row" sx={{ alignItems: "center", gap: 1, mb: 2 }}>
              <IconBrain size={14} style={{ color: "#c084fc" }} />
              <Typography sx={{ fontWeight: 800, fontSize: "0.85rem", color: "#c084fc" }}>
                Suggested Ad Copy
              </Typography>
            </Stack>
            <RichText
              content={
                typeof d.suggestedCopy === "string"
                  ? d.suggestedCopy
                  : d.suggestedCopy?.raw || JSON.stringify(d.suggestedCopy, null, 2)
              }
              accentColor="#c084fc"
            />
          </Box>
        </motion.div>
      )}

      {/* ── Automation Code (Claude Coding) ── */}
      {d.automationCode && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Box
            sx={{
              p: 3,
              mt: 2,
              borderRadius: 3,
              bgcolor: "rgba(52,211,153,0.04)",
              border: "1px solid rgba(52,211,153,0.1)",
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: 3,
                background: "linear-gradient(180deg, #34d399, #06b6d4)",
                borderRadius: "3px 0 0 3px",
              },
            }}
          >
            <Stack direction="row" sx={{ alignItems: "center", gap: 1, mb: 2 }}>
              <IconCode size={14} style={{ color: "#34d399" }} />
              <Typography sx={{ fontWeight: 800, fontSize: "0.85rem", color: "#34d399" }}>
                Automation Script
              </Typography>
            </Stack>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: "rgba(0,0,0,0.3)",
                border: "1px solid rgba(255,255,255,0.04)",
                fontFamily: '"SF Mono", "Fira Code", monospace',
                fontSize: "0.75rem",
                color: "rgba(255,255,255,0.6)",
                lineHeight: 1.7,
                whiteSpace: "pre-wrap",
                maxHeight: 200,
                overflowY: "auto",
                "&::-webkit-scrollbar": { width: 4 },
                "&::-webkit-scrollbar-thumb": {
                  bgcolor: "rgba(255,255,255,0.06)",
                  borderRadius: 4,
                },
              }}
            >
              {typeof d.automationCode === "string"
                ? d.automationCode
                : d.automationCode?.raw || JSON.stringify(d.automationCode, null, 2)}
            </Box>
          </Box>
        </motion.div>
      )}
    </Box>
  );
}

/* ═══════════════════════════════════════════════════════════════
   INSIGHT ENGINE RENDERER
   ═══════════════════════════════════════════════════════════════ */

function InsightResults({ response }) {
  const d = response?.data || {};
  const accent = "#06b6d4";
  const statusColor =
    d.healthStatus === "Critical"
      ? "#ef4444"
      : d.healthStatus === "Needs Optimization"
        ? "#f59e0b"
        : "#10b981";

  return (
    <Box>
      {/* Score + Status — dramatic header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 4,
            position: "relative",
            overflow: "hidden",
            background: `linear-gradient(135deg, ${accent}0a, rgba(0,0,0,0.25))`,
            border: `1px solid ${accent}15`,
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              background: `linear-gradient(90deg, ${accent}, ${statusColor})`,
              opacity: 0.7,
            },
          }}
        >
          <Stack direction="row" sx={{ alignItems: "center", gap: 3, flexWrap: "wrap" }}>
            <ScoreGauge score={d.overallScore} size={68} showLabel label="Health" />
            <Box sx={{ flex: 1 }}>
              <Stack direction="row" sx={{ alignItems: "center", gap: 1, mb: 0.75 }}>
                <Typography
                  sx={{
                    fontWeight: 900,
                    fontSize: "1.6rem",
                    color: "#f1f5f9",
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                  }}
                >
                  {d.overallScore || 0}
                </Typography>
                <Typography
                  sx={{ fontSize: "0.8rem", fontWeight: 500, color: "rgba(255,255,255,0.3)" }}
                >
                  /100
                </Typography>
                <Chip
                  label={d.healthStatus || "Unknown"}
                  size="small"
                  sx={{
                    bgcolor: `${statusColor}12`,
                    color: statusColor,
                    fontWeight: 800,
                    fontSize: "0.62rem",
                    height: 22,
                    border: `1px solid ${statusColor}20`,
                    ml: 0.5,
                  }}
                />
              </Stack>
              <Typography
                sx={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.55 }}
              >
                {d.recommendation || ""}
              </Typography>
            </Box>
          </Stack>
        </Box>
      </motion.div>

      {/* KPI Snapshot — color-coded cards */}
      {d.kpiSnapshot && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Box sx={{ mb: 3 }}>
            <Stack direction="row" sx={{ alignItems: "center", gap: 1, mb: 2 }}>
              <IconChartBar size={14} style={{ color: accent }} />
              <Typography
                sx={{
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.25)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                KPI Snapshot
              </Typography>
            </Stack>
            <Grid container spacing={1.5}>
              {[
                {
                  label: "ROAS",
                  value: d.kpiSnapshot.roas,
                  fmt: (v) => `${v}x`,
                  accent: "#10b981",
                },
                { label: "CTR", value: d.kpiSnapshot.ctr, fmt: (v) => `${v}%`, accent: "#3b82f6" },
                { label: "CPA", value: d.kpiSnapshot.cpa, fmt: (v) => `$${v}`, accent: "#f59e0b" },
                {
                  label: "Spend",
                  value: d.kpiSnapshot.spend,
                  fmt: (v) => `$${Number(v).toLocaleString()}`,
                  accent: "#ef4444",
                },
                {
                  label: "Revenue",
                  value: d.kpiSnapshot.revenue,
                  fmt: (v) => `$${Number(v).toLocaleString()}`,
                  accent: "#10b981",
                },
                {
                  label: "Conversions",
                  value: d.kpiSnapshot.conversions,
                  fmt: (v) => Number(v).toLocaleString(),
                  accent: "#8b5cf6",
                },
              ].map((kpi, i) => (
                <Grid size={{ xs: 4 }} key={kpi.label}>
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.15 + i * 0.05 }}
                  >
                    <MetricCard
                      label={kpi.label}
                      value={kpi.value != null ? kpi.fmt(kpi.value) : "—"}
                    />
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>
        </motion.div>
      )}

      {/* Top Issues — severity bars */}
      {d.topIssues?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Box sx={{ mb: 3 }}>
            <Stack direction="row" sx={{ alignItems: "center", gap: 1, mb: 2 }}>
              <IconAlertTriangle size={14} style={{ color: "#ef4444" }} />
              <Typography
                sx={{
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.25)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                Issues ({d.topIssues.length})
              </Typography>
            </Stack>
            <Stack spacing={1.5}>
              {d.topIssues.map((iss, i) => {
                const sc =
                  iss.severity === "High" || iss.severity === "Critical"
                    ? "#ef4444"
                    : iss.severity === "Medium"
                      ? "#f59e0b"
                      : "#10b981";
                const impactNum = Number(iss.financialImpact) || 0;
                const maxImpact = Math.max(
                  ...d.topIssues.map((x) => Number(x.financialImpact) || 0),
                  1,
                );
                const impactPct = (impactNum / maxImpact) * 100;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.25 + i * 0.06 }}
                  >
                    <Box
                      sx={{
                        p: 2.5,
                        borderRadius: 3,
                        position: "relative",
                        overflow: "hidden",
                        bgcolor: "rgba(255,255,255,0.02)",
                        border: `1px solid ${G.border}`,
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: 4,
                          background: `linear-gradient(180deg, ${sc}, ${sc}50)`,
                          borderRadius: "3px 0 0 3px",
                        },
                      }}
                    >
                      <Stack
                        direction="row"
                        sx={{ alignItems: "center", justifyContent: "space-between", mb: 1 }}
                      >
                        <Typography sx={{ fontWeight: 800, fontSize: "0.85rem", color: "#f1f5f9" }}>
                          {iss.issue}
                        </Typography>
                        <Stack direction="row" sx={{ gap: 0.75 }}>
                          <Chip
                            label={iss.severity}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: "0.58rem",
                              fontWeight: 800,
                              bgcolor: `${sc}10`,
                              color: sc,
                              border: `1px solid ${sc}18`,
                            }}
                          />
                          <Chip
                            label={`-$${impactNum.toLocaleString()}`}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: "0.58rem",
                              fontWeight: 800,
                              bgcolor: "rgba(239,68,68,0.08)",
                              color: "#f87171",
                              border: "1px solid rgba(239,68,68,0.12)",
                            }}
                          />
                        </Stack>
                      </Stack>
                      <Typography
                        sx={{
                          fontSize: "0.78rem",
                          color: "rgba(255,255,255,0.45)",
                          lineHeight: 1.55,
                          mb: 1.25,
                        }}
                      >
                        {iss.recommendation}
                      </Typography>
                      {/* Impact bar */}
                      <Box
                        sx={{
                          height: 4,
                          borderRadius: 2,
                          bgcolor: "rgba(255,255,255,0.03)",
                          overflow: "hidden",
                        }}
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${impactPct}%` }}
                          transition={{
                            duration: 0.8,
                            delay: 0.3 + i * 0.08,
                            ease: [0.4, 0, 0.2, 1],
                          }}
                          style={{
                            height: "100%",
                            borderRadius: 8,
                            background: `linear-gradient(90deg, ${sc}, ${sc}60)`,
                            boxShadow: `0 0 8px ${sc}20`,
                          }}
                        />
                      </Box>
                    </Box>
                  </motion.div>
                );
              })}
            </Stack>
          </Box>
        </motion.div>
      )}

      {/* Top Opportunities — revenue impact bars */}
      {d.topOpportunities?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Box sx={{ mb: 3 }}>
            <Stack direction="row" sx={{ alignItems: "center", gap: 1, mb: 2 }}>
              <IconTrendingUp size={14} style={{ color: "#10b981" }} />
              <Typography
                sx={{
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.25)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                Opportunities ({d.topOpportunities.length})
              </Typography>
            </Stack>
            <Stack spacing={1.5}>
              {d.topOpportunities.map((opp, i) => {
                const revNum = Number(opp.estimatedRevenueIncrease) || 0;
                const maxRev = Math.max(
                  ...d.topOpportunities.map((x) => Number(x.estimatedRevenueIncrease) || 0),
                  1,
                );
                const revPct = (revNum / maxRev) * 100;
                const effortColor =
                  opp.effort === "Low"
                    ? "#10b981"
                    : opp.effort === "Medium"
                      ? "#f59e0b"
                      : "#ef4444";
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.35 + i * 0.06 }}
                  >
                    <Box
                      sx={{
                        p: 2.5,
                        borderRadius: 3,
                        position: "relative",
                        overflow: "hidden",
                        bgcolor: "rgba(16,185,129,0.025)",
                        border: "1px solid rgba(16,185,129,0.08)",
                        transition: "all 0.25s ease",
                        "&:hover": {
                          bgcolor: "rgba(16,185,129,0.04)",
                          borderColor: "rgba(16,185,129,0.15)",
                          transform: "translateX(4px)",
                        },
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: 4,
                          background: "linear-gradient(180deg, #10b981, #06b6d4)",
                          borderRadius: "3px 0 0 3px",
                        },
                      }}
                    >
                      <Stack
                        direction="row"
                        sx={{ alignItems: "center", justifyContent: "space-between", mb: 1 }}
                      >
                        <Typography sx={{ fontWeight: 800, fontSize: "0.85rem", color: "#10b981" }}>
                          {opp.opportunity}
                        </Typography>
                        <Stack direction="row" sx={{ gap: 0.75 }}>
                          <Chip
                            label={opp.potentialLift}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: "0.58rem",
                              fontWeight: 800,
                              bgcolor: "rgba(16,185,129,0.1)",
                              color: "#34d399",
                              border: "1px solid rgba(16,185,129,0.15)",
                            }}
                          />
                          <Chip
                            label={`${opp.effort || "Medium"} effort`}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: "0.58rem",
                              fontWeight: 600,
                              bgcolor: `${effortColor}08`,
                              color: effortColor,
                              border: `1px solid ${effortColor}12`,
                            }}
                          />
                        </Stack>
                      </Stack>
                      <Typography
                        sx={{
                          fontSize: "0.78rem",
                          color: "rgba(255,255,255,0.45)",
                          mb: 1.25,
                          lineHeight: 1.55,
                        }}
                      >
                        {opp.recommendation}
                      </Typography>
                      <Stack direction="row" sx={{ alignItems: "center", gap: 1.5 }}>
                        <Box
                          sx={{
                            flex: 1,
                            height: 4,
                            borderRadius: 2,
                            bgcolor: "rgba(255,255,255,0.03)",
                            overflow: "hidden",
                          }}
                        >
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${revPct}%` }}
                            transition={{
                              duration: 0.8,
                              delay: 0.4 + i * 0.08,
                              ease: [0.4, 0, 0.2, 1],
                            }}
                            style={{
                              height: "100%",
                              borderRadius: 8,
                              background: "linear-gradient(90deg, #10b981, #06b6d4)",
                              boxShadow: "0 0 8px rgba(16,185,129,0.2)",
                            }}
                          />
                        </Box>
                        <Typography
                          sx={{
                            fontSize: "0.72rem",
                            fontWeight: 800,
                            color: "#34d399",
                            fontVariantNumeric: "tabular-nums",
                            minWidth: 60,
                            textAlign: "right",
                          }}
                        >
                          +${revNum.toLocaleString()}
                        </Typography>
                      </Stack>
                    </Box>
                  </motion.div>
                );
              })}
            </Stack>
          </Box>
        </motion.div>
      )}

      {/* Forecast If Optimized */}
      {d.forecastIfOptimized && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Box
            sx={{
              p: 3,
              borderRadius: 3,
              position: "relative",
              overflow: "hidden",
              background: `linear-gradient(135deg, ${accent}06, rgba(0,0,0,0.15))`,
              border: `1px solid ${accent}12`,
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 2,
                background: `linear-gradient(90deg, ${accent}, #10b981)`,
                opacity: 0.6,
              },
            }}
          >
            <Stack direction="row" sx={{ alignItems: "center", gap: 1, mb: 2 }}>
              <IconSparkles size={16} style={{ color: accent }} />
              <Typography sx={{ fontWeight: 800, fontSize: "0.9rem", color: accent }}>
                Forecast If Optimized ({d.forecastIfOptimized.timeframe || "30 days"})
              </Typography>
            </Stack>
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 4 }}>
                <MetricCard
                  label="Projected ROAS"
                  value={`${d.forecastIfOptimized.projectedROAS || 0}x`}
                />
              </Grid>
              <Grid size={{ xs: 4 }}>
                <MetricCard
                  label="Projected Revenue"
                  value={`$${Number(d.forecastIfOptimized.projectedRevenue || 0).toLocaleString()}`}
                />
              </Grid>
              <Grid size={{ xs: 4 }}>
                <MetricCard
                  label="Projected CPA"
                  value={`$${d.forecastIfOptimized.projectedCPA || 0}`}
                />
              </Grid>
            </Grid>
          </Box>
        </motion.div>
      )}

      {/* ── Actionable Copy (Claude Creative) ── */}
      {d.actionCopy && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
        >
          <Box
            sx={{
              p: 3,
              mt: 3,
              borderRadius: 3,
              bgcolor: "rgba(192,132,252,0.04)",
              border: "1px solid rgba(192,132,252,0.1)",
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: 3,
                background: "linear-gradient(180deg, #c084fc, #a855f7)",
                borderRadius: "3px 0 0 3px",
              },
            }}
          >
            <Stack direction="row" sx={{ alignItems: "center", gap: 1, mb: 2 }}>
              <IconBrain size={14} style={{ color: "#c084fc" }} />
              <Typography sx={{ fontWeight: 800, fontSize: "0.85rem", color: "#c084fc" }}>
                Improvement Recommendations
              </Typography>
            </Stack>
            <RichText content={d.actionCopy} accentColor="#c084fc" />
          </Box>
        </motion.div>
      )}

      {/* ── Analytics Code (Claude Coding) ── */}
      {d.analysisCode && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Box
            sx={{
              p: 3,
              mt: 2,
              borderRadius: 3,
              bgcolor: "rgba(52,211,153,0.04)",
              border: "1px solid rgba(52,211,153,0.1)",
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: 3,
                background: "linear-gradient(180deg, #34d399, #06b6d4)",
                borderRadius: "3px 0 0 3px",
              },
            }}
          >
            <Stack direction="row" sx={{ alignItems: "center", gap: 1, mb: 2 }}>
              <IconCode size={14} style={{ color: "#34d399" }} />
              <Typography sx={{ fontWeight: 800, fontSize: "0.85rem", color: "#34d399" }}>
                Analytics Query
              </Typography>
            </Stack>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: "rgba(0,0,0,0.3)",
                border: "1px solid rgba(255,255,255,0.04)",
                fontFamily: '"SF Mono", "Fira Code", monospace',
                fontSize: "0.75rem",
                color: "rgba(255,255,255,0.6)",
                lineHeight: 1.7,
                whiteSpace: "pre-wrap",
                maxHeight: 200,
                overflowY: "auto",
                "&::-webkit-scrollbar": { width: 4 },
                "&::-webkit-scrollbar-thumb": {
                  bgcolor: "rgba(255,255,255,0.06)",
                  borderRadius: 4,
                },
              }}
            >
              {d.analysisCode}
            </Box>
          </Box>
        </motion.div>
      )}
    </Box>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TOOL INLINE FORM — Main Component
   ═══════════════════════════════════════════════════════════════ */

export default function ToolInlineForm({ toolSlug, onBack }) {
  const theme = useTheme();
  const { user } = useAuth();
  const isAdmin =
    user?.email?.toLowerCase() === "help@marketingtool.pro" || user?.name === "testuser1";
  const downMD = useMediaQuery(theme.breakpoints.down("md"));
  const tool = useMemo(() => getToolBySlug(toolSlug), [toolSlug]);
  const relatedTools = useMemo(() => (tool ? getRelatedTools(toolSlug, 4) : []), [toolSlug, tool]);

  const [formData, setFormData] = useState({});
  const [engineResponse, setEngineResponse] = useState(null);
  const [activeVar, setActiveVar] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedMedia, setUploadedMedia] = useState(null); // { url, type: 'image'|'video' }
  const [copied, setCopied] = useState(false);
  const [gateInfo, setGateInfo] = useState(null); // { remaining, trialDaysLeft, tier, blocked, reason, code }

  if (!tool) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h5">Tool not found</Typography>
        <Button onClick={onBack} sx={{ mt: 2 }}>
          Back to Tools
        </Button>
      </Box>
    );
  }

  const handleFieldChange = (fieldName, value) =>
    setFormData((prev) => ({ ...prev, [fieldName]: value }));

  /* ─── GENERATE (single call — engine returns structured data) ─── */
  const handleGenerate = async () => {
    const mainField = tool.formFields.find((f) => f.name === "mainInput");
    const mainValue = formData.mainInput || "";
    if (mainField?.required && !mainValue.trim()) {
      setError("Please fill in the required field.");
      return;
    }

    setLoading(true);
    setError(null);
    setEngineResponse(null);
    setActiveVar(0);

    const additionalInputs = { ...formData };
    delete additionalInputs.mainInput;

    try {
      const res = await executeGeneration({
        toolSlug: tool.slug,
        toolName: tool.name,
        toolDescription: tool.description,
        toolBadge: tool.badge,
        mainInput: mainValue,
        additionalInputs,
        userId: user?.id || "anonymous",
        engineType: SLUG_TO_ENGINE[tool.slug],
      });

      // Gating: blocked by trial/daily limit (admin always bypasses)
      if (!isAdmin && res?.success === false && res?.code) {
        setGateInfo({
          blocked: true,
          reason: res.error,
          code: res.code,
          remaining: res.remaining ?? 0,
          trialDaysLeft: res.trialDaysLeft ?? 0,
          tier: res.tier || "free",
        });
        setLoading(false);
        return;
      }

      if (res?.engine) {
        setEngineResponse(res);
        // Update gate info from response
        setGateInfo({
          blocked: false,
          remaining: res.remaining ?? null,
          trialDaysLeft: res.trialDaysLeft ?? null,
          tier: res.tier || "free",
        });
      } else {
        // Legacy fallback — wrap text in creative engine format
        const text = typeof res === "string" ? res : res?.result || JSON.stringify(res, null, 2);
        setEngineResponse({
          engine: "creative",
          score: 0,
          data: {
            overallScore: 0,
            variants: [
              {
                angle: "Professional",
                headline: tool.name,
                primaryCopy: text,
                cta: "",
                performanceScore: 0,
              },
            ],
          },
        });
      }
    } catch (err) {
      setError(err.message || "Generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ─── ACTIONS ─── */
  const handleCopy = () => {
    let text = "";
    const d = engineResponse?.data || {};
    if (engineResponse?.engine === "creative") {
      const v = (d.variants || [])[activeVar] || {};
      text = [v.headline, v.hook, v.primaryCopy, v.cta, v.caption].filter(Boolean).join("\n\n");
    } else {
      text = JSON.stringify(d, null, 2);
    }
    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const d = engineResponse?.data || {};
    const blob = new Blob([JSON.stringify(d, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${tool.slug}-${engineResponse?.engine || "result"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePdf = () => {
    if (engineResponse) exportEnginePdf(tool.name, engineResponse);
  };

  /* ─── FORM FIELD RENDERER ─── */
  const inputSx = {
    "& .MuiOutlinedInput-root": {
      background: "rgba(255,255,255,0.025)",
      borderRadius: G.radiusSm,
      transition: "all 0.3s ease",
      "& fieldset": { borderColor: G.border, transition: "border-color 0.3s ease" },
      "&:hover fieldset": { borderColor: G.borderHover },
      "&.Mui-focused fieldset": { borderColor: "#6366f1", borderWidth: 1 },
      "&.Mui-focused": { boxShadow: "0 0 0 3px rgba(99,102,241,0.08)" },
    },
  };

  const renderFormField = (field) => {
    switch (field.type) {
      case "textarea":
        return (
          <Box key={field.name}>
            <InputLabel
              sx={{
                mb: 0.75,
                color: "rgba(255,255,255,0.55)",
                fontSize: "0.82rem",
                fontWeight: 600,
                letterSpacing: "0.02em",
              }}
            >
              {field.label}
            </InputLabel>
            <TextField
              placeholder={field.placeholder}
              required={field.required}
              multiline
              rows={5}
              fullWidth
              value={formData[field.name] || ""}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              sx={inputSx}
            />
          </Box>
        );
      case "select":
        return (
          <Box key={field.name}>
            <InputLabel
              sx={{
                mb: 0.75,
                color: "rgba(255,255,255,0.55)",
                fontSize: "0.82rem",
                fontWeight: 600,
                letterSpacing: "0.02em",
              }}
            >
              {field.label}
            </InputLabel>
            <FormControl fullWidth>
              <Select
                value={formData[field.name] || ""}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                displayEmpty
                sx={inputSx}
              >
                <MenuItem value="" disabled>
                  Select...
                </MenuItem>
                {field.options?.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        );
      case "number":
        return (
          <Box key={field.name}>
            <InputLabel
              sx={{
                mb: 0.75,
                color: "rgba(255,255,255,0.55)",
                fontSize: "0.82rem",
                fontWeight: 600,
                letterSpacing: "0.02em",
              }}
            >
              {field.label}
            </InputLabel>
            <TextField
              placeholder={field.placeholder}
              required={field.required}
              type="number"
              fullWidth
              value={formData[field.name] || ""}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              sx={inputSx}
            />
          </Box>
        );
      case "boolean":
        return (
          <Box key={field.name} sx={{ mt: 1 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData[field.name] ?? field.default ?? false}
                  onChange={(e) => handleFieldChange(field.name, e.target.checked)}
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": { color: "#8b5cf6" },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                      backgroundColor: "#8b5cf6",
                    },
                  }}
                />
              }
              label={
                <Typography
                  sx={{ fontSize: "0.82rem", fontWeight: 600, color: "rgba(255,255,255,0.7)" }}
                >
                  {field.label}
                </Typography>
              }
            />
          </Box>
        );
      case "checkbox":
        return (
          <FormControlLabel
            key={field.name}
            control={
              <Checkbox
                checked={!!formData[field.name]}
                onChange={(e) => handleFieldChange(field.name, e.target.checked)}
              />
            }
            label={field.label}
          />
        );
      default:
        return (
          <Box key={field.name}>
            <InputLabel
              sx={{
                mb: 0.75,
                color: "rgba(255,255,255,0.55)",
                fontSize: "0.82rem",
                fontWeight: 600,
                letterSpacing: "0.02em",
              }}
            >
              {field.label}
            </InputLabel>
            <TextField
              placeholder={field.placeholder}
              required={field.required}
              fullWidth
              value={formData[field.name] || ""}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              sx={inputSx}
            />
          </Box>
        );
    }
  };

  const engineType = engineResponse?.engine;
  const hasResults = !!engineResponse;

  /* ═══════════════════  RENDER  ═══════════════════ */
  return (
    <Stack sx={{ gap: 3 }}>
      {/* ── Back Button ── */}
      <Button
        startIcon={<IconArrowLeft size={18} />}
        onClick={onBack}
        color="inherit"
        sx={{
          fontWeight: 600,
          alignSelf: "flex-start",
          color: "text.secondary",
          borderRadius: 2,
          px: 2,
          py: 0.75,
          "&:hover": { color: "text.primary", bgcolor: "rgba(255,255,255,0.04)" },
        }}
      >
        Back
      </Button>

      {/* ═══════════════════  HERO CARD  ═══════════════════ */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: G.radius,
          background: G.bg,
          backdropFilter: G.blur,
          WebkitBackdropFilter: G.blur,
          border: `1px solid ${G.border}`,
          boxShadow: G.shadow,
          p: { xs: 3, md: 4 },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -80,
            right: -60,
            width: 240,
            height: 240,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)",
            pointerEvents: "none",
            transition: "all 0.6s ease",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -60,
            left: -40,
            width: 160,
            height: 160,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <Stack direction="row" sx={{ alignItems: "center", gap: 3, position: "relative" }}>
          <Box sx={{ position: "relative", width: 80, height: 80, flexShrink: 0 }}>
            <Box
              sx={{
                position: "absolute",
                inset: -4,
                borderRadius: 4,
                background:
                  "conic-gradient(from 180deg, rgba(255,255,255,0.08), transparent, rgba(255,255,255,0.04), transparent, rgba(255,255,255,0.08))",
                animation: "borderSpin 6s linear infinite",
                "@keyframes borderSpin": {
                  "0%": { transform: "rotate(0deg)" },
                  "100%": { transform: "rotate(360deg)" },
                },
                opacity: 0.6,
              }}
            />
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: 3.5,
                p: 1.25,
                position: "relative",
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${G.border}`,
              }}
            >
              <img
                src={getIconImage(tool.badge)}
                alt={tool.name}
                width={56}
                height={56}
                style={{ objectFit: "contain", display: "block" }}
              />
            </Box>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" sx={{ alignItems: "center", gap: 1.5, mb: 1, flexWrap: "wrap" }}>
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: "1.5rem",
                  letterSpacing: "-0.03em",
                  lineHeight: 1.2,
                }}
              >
                {tool.name}
              </Typography>
              <Chip
                label={tool.badge}
                size="small"
                sx={{
                  bgcolor: "rgba(255,255,255,0.06)",
                  color: "rgba(255,255,255,0.7)",
                  fontWeight: 700,
                  fontSize: "0.72rem",
                  height: 26,
                  borderRadius: 2,
                  border: "1px solid rgba(255,255,255,0.1)",
                  letterSpacing: "0.02em",
                }}
              />
            </Stack>
            <Typography
              sx={{
                color: "rgba(255,255,255,0.5)",
                fontSize: "0.9rem",
                maxWidth: 560,
                lineHeight: 1.5,
              }}
            >
              {tool.description}
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* ═══════════════════  MAIN LAYOUT  ═══════════════════ */}
      <Box
        sx={{
          background: G.bg,
          backdropFilter: G.blur,
          WebkitBackdropFilter: G.blur,
          border: `1px solid ${G.border}`,
          boxShadow: G.shadow,
          borderRadius: G.radius,
          overflow: "hidden",
        }}
      >
        <Grid container>
          {/* ── LEFT: Form + Results ── */}
          <Grid size={{ xs: 12, md: hasResults ? 12 : 8 }}>
            <Stack sx={{ gap: 3.5, p: { xs: 3, md: 4 } }}>
              {/* Section header */}
              <Box>
                <Stack direction="row" sx={{ alignItems: "center", gap: 1.25, mb: 0.5 }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background:
                        "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.15))",
                      border: "1px solid rgba(99,102,241,0.12)",
                    }}
                  >
                    <IconSparkles size={16} style={{ color: "#a5b4fc" }} />
                  </Box>
                  <Typography
                    sx={{ fontWeight: 800, fontSize: "1.15rem", letterSpacing: "-0.02em" }}
                  >
                    Generate
                  </Typography>
                </Stack>
                <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem", pl: 5.5 }}>
                  Fill in details — AI engine generates structured results
                </Typography>
              </Box>

              {/* Form fields */}
              <Stack spacing={2.5}>{tool.formFields.map(renderFormField)}</Stack>

              {/* Image / Video Upload */}
              <Box>
                <InputLabel
                  sx={{
                    mb: 0.75,
                    color: "rgba(255,255,255,0.55)",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    letterSpacing: "0.02em",
                  }}
                >
                  Product Image or Video (optional)
                </InputLabel>
                {uploadedMedia ? (
                  <Box
                    sx={{
                      position: "relative",
                      borderRadius: G.radiusSm,
                      overflow: "hidden",
                      border: `1px solid ${G.border}`,
                    }}
                  >
                    {uploadedMedia.type === "video" ? (
                      <video
                        src={sanitizeMediaUrl(uploadedMedia.url)}
                        controls
                        style={{
                          width: "100%",
                          maxHeight: 200,
                          objectFit: "cover",
                          display: "block",
                          background: "#000",
                        }}
                      />
                    ) : (
                      <Box
                        component="img"
                        src={sanitizeMediaUrl(uploadedMedia.url)}
                        alt="Uploaded"
                        sx={{ width: "100%", maxHeight: 200, objectFit: "cover", display: "block" }}
                      />
                    )}
                    <Button
                      size="small"
                      onClick={() => {
                        URL.revokeObjectURL(uploadedMedia.url);
                        setUploadedMedia(null);
                      }}
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        minWidth: 0,
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 2,
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        textTransform: "none",
                        bgcolor: "rgba(0,0,0,0.6)",
                        color: "#fff",
                        backdropFilter: "blur(8px)",
                        "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
                      }}
                    >
                      Remove
                    </Button>
                  </Box>
                ) : (
                  <Button
                    component="label"
                    fullWidth
                    sx={{
                      py: 3,
                      borderRadius: G.radiusSm,
                      border: `1px dashed ${G.border}`,
                      bgcolor: "rgba(255,255,255,0.015)",
                      color: "rgba(255,255,255,0.4)",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      textTransform: "none",
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,0.03)",
                        borderColor: "rgba(255,255,255,0.12)",
                      },
                    }}
                  >
                    Upload image or video for ad preview
                    <input
                      type="file"
                      hidden
                      accept="image/*,video/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const isVideo = file.type.startsWith("video/");
                        setUploadedMedia({
                          url: URL.createObjectURL(file),
                          type: isVideo ? "video" : "image",
                        });
                        e.target.value = "";
                      }}
                    />
                  </Button>
                )}
              </Box>

              {/* Generate button + remaining counter */}
              <Box>
                {!isAdmin && gateInfo?.blocked ? (
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled
                    startIcon={<IconLock size={18} />}
                    sx={{
                      borderRadius: 3,
                      py: 1.75,
                      fontWeight: 700,
                      fontSize: "0.92rem",
                      textTransform: "none",
                      background: "rgba(255,255,255,0.04)",
                      color: "rgba(255,255,255,0.25)",
                      boxShadow: "none",
                    }}
                  >
                    {gateInfo.code === "DAILY_LIMIT" ? "Daily limit reached" : "Trial expired"}
                  </Button>
                ) : (
                  <Box sx={{ position: "relative", overflow: "hidden", borderRadius: 3 }}>
                    <Button
                      variant="contained"
                      size="large"
                      fullWidth
                      onClick={handleGenerate}
                      disabled={loading}
                      startIcon={
                        loading ? (
                          <CircularProgress size={18} color="inherit" />
                        ) : (
                          <IconWand size={18} />
                        )
                      }
                      sx={{
                        position: "relative",
                        borderRadius: 3,
                        py: 1.75,
                        fontWeight: 700,
                        fontSize: "0.92rem",
                        letterSpacing: "-0.01em",
                        textTransform: "none",
                        background:
                          "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
                        boxShadow:
                          "0 4px 24px -4px rgba(99,102,241,0.45), inset 0 1px 0 0 rgba(255,255,255,0.15)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          background:
                            "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #9333ea 100%)",
                          boxShadow: "0 8px 32px -4px rgba(99,102,241,0.55)",
                          transform: "translateY(-1px)",
                        },
                        "&.Mui-disabled": {
                          background: "rgba(255,255,255,0.06)",
                          boxShadow: "none",
                          color: "rgba(255,255,255,0.25)",
                        },
                        overflow: "hidden",
                        "&::after": loading
                          ? {}
                          : {
                              content: '""',
                              position: "absolute",
                              top: 0,
                              left: "-100%",
                              width: "200%",
                              height: "100%",
                              background:
                                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)",
                              animation: "btnShimmer 3s ease-in-out infinite",
                              "@keyframes btnShimmer": {
                                "0%": { transform: "translateX(-50%)" },
                                "100%": { transform: "translateX(50%)" },
                              },
                            },
                      }}
                    >
                      {loading ? "Generating..." : "Generate"}
                    </Button>
                  </Box>
                )}
                {/* Remaining counter */}
                {!isAdmin && gateInfo && gateInfo.tier === "free" && !gateInfo.blocked && (
                  <Stack
                    direction="row"
                    sx={{ justifyContent: "center", alignItems: "center", gap: 1.5, mt: 1.5 }}
                  >
                    <Typography sx={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)" }}>
                      {gateInfo.remaining}/3 generations left today
                    </Typography>
                    {gateInfo.trialDaysLeft > 0 && (
                      <Chip
                        label={`${gateInfo.trialDaysLeft}d trial`}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: "0.6rem",
                          fontWeight: 700,
                          bgcolor: "rgba(245,158,11,0.08)",
                          color: "#f59e0b",
                          border: "1px solid rgba(245,158,11,0.15)",
                        }}
                      />
                    )}
                  </Stack>
                )}
              </Box>

              {/* Loading skeleton */}
              {loading && <ResultSkeleton toolSlug={tool.slug} />}

              {error && (
                <Alert severity="error" onClose={() => setError(null)} sx={{ borderRadius: 3 }}>
                  {error}
                </Alert>
              )}

              {/* ═══════════════════  GATING: UPGRADE OVERLAY  ═══════════════════ */}
              {!isAdmin && gateInfo?.blocked && (
                <Box
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    textAlign: "center",
                    background:
                      "linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(99,102,241,0.04) 50%, rgba(6,182,212,0.03) 100%)",
                    border: "1px solid rgba(139,92,246,0.18)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: -30,
                      right: -30,
                      width: 120,
                      height: 120,
                      borderRadius: "50%",
                      background: "radial-gradient(circle, rgba(139,92,246,0.12), transparent)",
                      pointerEvents: "none",
                    }}
                  />
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 3,
                      mx: "auto",
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background:
                        gateInfo.code === "DAILY_LIMIT"
                          ? "linear-gradient(135deg, #f59e0b, #f97316)"
                          : "linear-gradient(135deg, #ef4444, #f43f5e)",
                      boxShadow:
                        gateInfo.code === "DAILY_LIMIT"
                          ? "0 4px 20px -4px rgba(245,158,11,0.5)"
                          : "0 4px 20px -4px rgba(239,68,68,0.5)",
                    }}
                  >
                    {gateInfo.code === "DAILY_LIMIT" ? (
                      <IconClock size={24} style={{ color: "#fff" }} />
                    ) : (
                      <IconLock size={24} style={{ color: "#fff" }} />
                    )}
                  </Box>
                  <Typography
                    sx={{ fontWeight: 800, fontSize: "1.2rem", mb: 1, letterSpacing: "-0.02em" }}
                  >
                    {gateInfo.code === "DAILY_LIMIT"
                      ? "You've reached today's AI limit"
                      : "Free trial ended"}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.88rem",
                      color: "rgba(255,255,255,0.55)",
                      mb: 3,
                      maxWidth: 400,
                      mx: "auto",
                      lineHeight: 1.6,
                    }}
                  >
                    {gateInfo.code === "DAILY_LIMIT"
                      ? "Upgrade to unlock unlimited generation + real campaign automation."
                      : "Upgrade to Pro to continue generating insights, automations, and creative content."}
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<IconCrown size={18} />}
                    onClick={() => (window.location.href = "/pricing")}
                    sx={{
                      borderRadius: 3,
                      px: 4,
                      py: 1.5,
                      fontWeight: 700,
                      fontSize: "0.92rem",
                      textTransform: "none",
                      background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
                      boxShadow: "0 4px 24px -4px rgba(139,92,246,0.5)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 32px -4px rgba(139,92,246,0.6)",
                      },
                    }}
                  >
                    Upgrade to Pro
                  </Button>
                  {gateInfo.code === "DAILY_LIMIT" && (
                    <Typography sx={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)", mt: 2 }}>
                      Resets at midnight UTC
                    </Typography>
                  )}
                </Box>
              )}

              {/* ═══════════════════  ENGINE RESULTS  ═══════════════════ */}
              {hasResults && !loading && (
                <Box>
                  {/* Results header */}
                  <Box
                    sx={{
                      position: "relative",
                      mb: 3,
                      borderRadius: 4,
                      overflow: "hidden",
                      height: 80,
                      bgcolor: "rgba(255,255,255,0.02)",
                      backdropFilter: "blur(40px)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <Box
                      component="img"
                      src={getBannerImage(tool.badge)}
                      alt=""
                      sx={{
                        position: "absolute",
                        right: 0,
                        top: 0,
                        height: "100%",
                        width: "40%",
                        objectFit: "cover",
                        opacity: 0.06,
                        filter: "blur(1px)",
                        maskImage: "linear-gradient(to right, transparent, black)",
                        WebkitMaskImage: "linear-gradient(to right, transparent, black)",
                      }}
                    />
                    <Stack
                      direction="row"
                      sx={{
                        alignItems: "center",
                        justifyContent: "space-between",
                        p: 2.5,
                        position: "relative",
                      }}
                    >
                      <Stack direction="row" sx={{ alignItems: "center", gap: 2 }}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 3,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "rgba(255,255,255,0.06)",
                            border: "1px solid rgba(255,255,255,0.08)",
                          }}
                        >
                          <IconSparkles size={18} style={{ color: "rgba(255,255,255,0.7)" }} />
                        </Box>
                        <Box>
                          <Typography sx={{ fontWeight: 800, fontSize: "1rem" }}>
                            {engineType === "creative"
                              ? "Creative Engine"
                              : engineType === "automation"
                                ? "Automation Engine"
                                : "Insight Engine"}
                          </Typography>
                          <Typography sx={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.45)" }}>
                            {engineType === "creative"
                              ? `${(engineResponse?.data?.variants || []).length} angle variants`
                              : "AI-powered analysis"}
                            {engineResponse?.meta?.latencyMs
                              ? ` · ${(engineResponse.meta.latencyMs / 1000).toFixed(1)}s`
                              : ""}
                          </Typography>
                        </Box>
                      </Stack>
                      <Chip
                        label={`Score: ${engineResponse?.score || 0}`}
                        size="small"
                        sx={{
                          height: 26,
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          bgcolor: "rgba(255,255,255,0.06)",
                          color: "rgba(255,255,255,0.7)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: 2,
                        }}
                      />
                    </Stack>
                  </Box>

                  {/* Engine-specific rendering */}
                  {engineType === "creative" && (
                    <CreativeResults
                      response={engineResponse}
                      activeVar={activeVar}
                      setActiveVar={setActiveVar}
                      tool={tool}
                      gateInfo={gateInfo}
                      uploadedMedia={uploadedMedia}
                      isAdmin={isAdmin}
                    />
                  )}
                  {engineType === "automation" && <AutomationResults response={engineResponse} />}
                  {engineType === "insight" && <InsightResults response={engineResponse} />}

                  {/* ── Action Bar ── */}
                  <Box
                    sx={{
                      px: 3,
                      py: 2.25,
                      mt: 2.5,
                      borderRadius: 3,
                      background: "rgba(0,0,0,0.3)",
                      backdropFilter: "blur(16px)",
                      border: `1px solid ${G.border}`,
                    }}
                  >
                    <Stack direction="row" sx={{ gap: 1, flexWrap: "wrap", alignItems: "center" }}>
                      <Button
                        size="small"
                        startIcon={copied ? <IconCheck size={15} /> : <IconCopy size={15} />}
                        onClick={handleCopy}
                        sx={{
                          borderRadius: 2.5,
                          px: 2.25,
                          py: 0.85,
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          textTransform: "none",
                          color: copied ? "#10b981" : "rgba(255,255,255,0.7)",
                          bgcolor: copied ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.04)",
                          border: `1px solid ${copied ? "rgba(16,185,129,0.25)" : "rgba(255,255,255,0.06)"}`,
                          transition: "all 0.25s ease",
                          "&:hover": {
                            bgcolor: "rgba(255,255,255,0.07)",
                            borderColor: "rgba(255,255,255,0.12)",
                            transform: "translateY(-1px)",
                          },
                        }}
                      >
                        {copied ? "Copied!" : "Copy"}
                      </Button>
                      <Button
                        size="small"
                        startIcon={<IconDownload size={15} />}
                        onClick={handleDownload}
                        sx={{
                          borderRadius: 2.5,
                          px: 2.25,
                          py: 0.85,
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          textTransform: "none",
                          color: "rgba(255,255,255,0.7)",
                          bgcolor: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.06)",
                          transition: "all 0.25s ease",
                          "&:hover": {
                            bgcolor: "rgba(255,255,255,0.07)",
                            borderColor: "rgba(255,255,255,0.12)",
                            transform: "translateY(-1px)",
                          },
                        }}
                      >
                        Export JSON
                      </Button>
                      <Button
                        size="small"
                        startIcon={<IconFileText size={15} />}
                        onClick={handlePdf}
                        sx={{
                          borderRadius: 2.5,
                          px: 2.25,
                          py: 0.85,
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          textTransform: "none",
                          color: "#f59e0b",
                          bgcolor: "rgba(245,158,11,0.06)",
                          border: "1px solid rgba(245,158,11,0.12)",
                          transition: "all 0.25s ease",
                          "&:hover": {
                            bgcolor: "rgba(245,158,11,0.1)",
                            borderColor: "rgba(245,158,11,0.2)",
                            transform: "translateY(-1px)",
                          },
                        }}
                      >
                        Save PDF
                      </Button>
                      <Box sx={{ flex: 1 }} />
                      <Button
                        size="small"
                        startIcon={<IconRefresh size={15} />}
                        onClick={handleGenerate}
                        disabled={loading}
                        sx={{
                          borderRadius: 2.5,
                          px: 2.25,
                          py: 0.85,
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          textTransform: "none",
                          color: "rgba(255,255,255,0.7)",
                          bgcolor: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          transition: "all 0.25s ease",
                          "&:hover": {
                            bgcolor: "rgba(255,255,255,0.07)",
                            borderColor: "rgba(255,255,255,0.12)",
                            transform: "translateY(-1px)",
                          },
                          "&.Mui-disabled": {
                            color: "rgba(255,255,255,0.15)",
                            bgcolor: "rgba(255,255,255,0.02)",
                            borderColor: "rgba(255,255,255,0.04)",
                          },
                        }}
                      >
                        Regenerate
                      </Button>
                    </Stack>
                  </Box>
                </Box>
              )}
            </Stack>
          </Grid>

          {/* Vertical divider — hidden when results shown */}
          {!hasResults && (
            <Divider
              {...(!downMD ? { orientation: "vertical", flexItem: true } : { sx: { width: 1 } })}
              sx={{ borderColor: G.border }}
            />
          )}

          {/* ── RIGHT SIDEBAR — hidden when results shown ── */}
          <Grid size={{ xs: 12, md: 4 }} sx={{ display: hasResults ? "none" : "block" }}>
            <Stack sx={{ gap: 2, p: { xs: 3, md: 3 } }}>
              {/* Tips */}
              <Stack direction="row" sx={{ alignItems: "center", gap: 1.25 }}>
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(245,158,11,0.1)",
                    border: "1px solid rgba(245,158,11,0.12)",
                  }}
                >
                  <IconBulb size={14} style={{ color: "#f59e0b" }} />
                </Box>
                <Typography sx={{ fontWeight: 700, fontSize: "0.95rem" }}>Tips</Typography>
              </Stack>
              {tool.tips.map((tip, i) => (
                <Box
                  key={i}
                  sx={{
                    p: 2.25,
                    borderRadius: G.radiusSm,
                    bgcolor: G.surface,
                    border: `1px solid ${G.border}`,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      bgcolor: G.surfaceHover,
                      borderColor: G.borderHover,
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  <Typography
                    sx={{ fontWeight: 700, mb: 0.5, fontSize: "0.82rem", color: "#e2e8f0" }}
                  >
                    {tip.title}
                  </Typography>
                  <Typography
                    sx={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}
                  >
                    {tip.desc}
                  </Typography>
                </Box>
              ))}
            </Stack>

            {/* Related tools */}
            {relatedTools.length > 0 && (
              <>
                <Divider sx={{ borderColor: G.border }} />
                <Stack sx={{ gap: 1.5, p: { xs: 3, md: 3 } }}>
                  <Typography sx={{ fontWeight: 700, fontSize: "0.95rem" }}>
                    Related Tools
                  </Typography>
                  {relatedTools.map((rt) => (
                    <Box
                      key={rt.slug}
                      onClick={() => onBack(rt.slug)}
                      sx={{
                        p: 2,
                        borderRadius: G.radiusSm,
                        bgcolor: G.surface,
                        cursor: "pointer",
                        border: `1px solid ${G.border}`,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          bgcolor: "rgba(255,255,255,0.04)",
                          borderColor: "rgba(255,255,255,0.1)",
                          transform: "translateX(4px)",
                        },
                      }}
                    >
                      <Stack
                        direction="row"
                        sx={{ alignItems: "center", justifyContent: "space-between" }}
                      >
                        <Typography sx={{ fontWeight: 600, fontSize: "0.82rem" }}>
                          {rt.name}
                        </Typography>
                        <IconArrowRight size={14} style={{ opacity: 0.3 }} />
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </>
            )}
          </Grid>
        </Grid>
      </Box>
    </Stack>
  );
}

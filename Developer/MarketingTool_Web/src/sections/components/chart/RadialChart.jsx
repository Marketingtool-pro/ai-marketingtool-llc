// @mui
import { useTheme } from "@mui/material/styles";
import { Gauge } from "@mui/x-charts-pro/Gauge";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

// @project
import MainCard from "@/components/MainCard";

// @assets
import { IconArrowNarrowRight, IconArrowUpRight } from "@tabler/icons-react";

/***************************  CHART - REDIAL  ***************************/

export default function AnalyticsPerformanceRedialChart() {
  const theme = useTheme();

  return (
    <MainCard sx={{ p: 0.75, pr: 3, pl: 2 }}>
      <Stack direction="row" sx={{ gap: 1.5 }}>
        <Gauge
          width={100}
          height={100}
          value={75}
          sx={{
            "& .MuiGauge-valueText": {
              "& text": { typography: "caption1", fill: theme.vars.palette.primary.main },
            },
            "& .MuiGauge-referenceArc": { fill: theme.vars.palette.secondary.lighter },
          }}
          text={({ value }) => `${value}%`}
          innerRadius="75%"
          outerRadius="100%"
        />
        <Stack
          direction="row"
          sx={{ justifyContent: "space-between", alignItems: "center", width: 1, gap: 1 }}
        >
          <Stack sx={{ gap: 0.5 }}>
            <Typography variant="caption1" sx={{ color: "text.disabled" }}>
              Total Revenue
            </Typography>
            <Stack direction="row" sx={{ gap: 0.5, alignItems: "center", flexWrap: "wrap" }}>
              <Typography variant="h4">Radial Chart</Typography>
              <Chip
                label="24.5%"
                variant="text"
                size="small"
                avatar={<IconArrowUpRight />}
                color="success"
              />
            </Stack>
          </Stack>
          <IconButton variant="outlined" color="secondary" size="small">
            <IconArrowNarrowRight size={16} />
          </IconButton>
        </Stack>
      </Stack>
    </MainCard>
  );
}

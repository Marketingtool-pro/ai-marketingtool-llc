// @mui
import { useTheme } from "@mui/material/styles";
import { BarChart } from "@mui/x-charts-pro/BarChart";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

// @project
import MainCard from "@/components/MainCard";

/***************************  CHART - TRAFFIC DEVICE  ***************************/

export default function AnalyticsBehaviorTrafficDevice({ data }) {
  const theme = useTheme();

  return (
    <MainCard>
      <Stack sx={{ gap: 2.5 }}>
        <Typography variant="subtitle1">Traffic in Device</Typography>
        <BarChart
          xAxis={[
            {
              scaleType: "band",
              data: ["Computer", "Tablet", "Mobile"],
              categoryGapRatio: 0,
              disableLine: true,
              disableTicks: true,
            },
          ]}
          yAxis={[
            {
              disableLine: true,
              disableTicks: true,
              tickLabelStyle: { width: 0, display: "none" },
            },
          ]}
          series={[
            {
              id: "TrafficInDevice",
              data: data ? [data.computer, data.tablet, data.mobile] : [0, 0, 0],
            },
          ]}
          height={284}
          axisHighlight={{ x: "none" }}
          margin={{ top: 0, right: 0, bottom: 0, left: -50 }}
          sx={{ "& .MuiBarElement-series-TrafficInDevice": { fill: "url(#chart4Gradient)" } }}
          barLabel={(item) => `${item.value?.toString()}%`}
        >
          <defs>
            <linearGradient id="chart4Gradient" gradientTransform="rotate(90)">
              <stop offset="10%" stopColor={theme.vars.palette.primary.main} stopOpacity={0.2} />
              <stop
                offset="90%"
                stopColor={theme.vars.palette.background.default}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
        </BarChart>
      </Stack>
    </MainCard>
  );
}

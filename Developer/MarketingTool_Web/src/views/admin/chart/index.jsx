import { useState } from "react";

// @mui
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import IconButton from "@mui/material/IconButton";

// @mui/x-charts-pro
import { LineChart } from "@mui/x-charts-pro/LineChart";
import { BarChart } from "@mui/x-charts-pro/BarChart";
import { PieChart } from "@mui/x-charts-pro/PieChart";
import { Gauge } from "@mui/x-charts-pro/Gauge";

// @project
import MainCard from "@/components/MainCard";

// @assets
import { IconDownload, IconRefresh } from "@tabler/icons-react";

// Chart Data
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const lineChartData = {
  pageViews: [190, 230, 240, 280, 320, 380, 420, 450, 480, 520, 580, 650],
  uniqueVisitors: [120, 150, 180, 200, 240, 280, 310, 340, 360, 400, 450, 520],
};

const barChartData = {
  revenue: [12, 15, 18, 14, 22, 28, 32, 29, 35, 42, 38, 45],
  expenses: [8, 9, 10, 8.5, 12, 15, 17, 16, 19, 22, 20, 24],
};

const pieChartData = [
  { id: 0, value: 86.5, label: "Computer" },
  { id: 1, value: 42.5, label: "Tablet" },
  { id: 2, value: 64.2, label: "Mobile" },
];

/***************************  CHART PAGE  ***************************/

export default function ChartPage() {
  const theme = useTheme();
  const [lineView, setLineView] = useState("monthly");
  const [barView, setBarView] = useState("monthly");

  const primaryColor = theme.palette.primary.main;
  const primaryLight = theme.palette.primary.light;

  return (
    <Stack spacing={3}>
      {/* Header */}
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography variant="h4" sx={{ mb: 0.5 }}>
            Charts
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Data visualization components for analytics and reporting
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <IconButton size="small">
            <IconRefresh size={18} />
          </IconButton>
          <IconButton size="small">
            <IconDownload size={18} />
          </IconButton>
        </Stack>
      </Stack>

      {/* Line Chart */}
      <MainCard>
        <Stack sx={{ gap: 2 }}>
          <Stack
            direction="row"
            sx={{ justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}
          >
            <Box>
              <Typography variant="h5">Line Chart</Typography>
              <Typography variant="body2" color="text.secondary">
                Analyze user engagement and improve your product with real-time analytics.
              </Typography>
            </Box>
            <ToggleButtonGroup
              value={lineView}
              exclusive
              onChange={(e, v) => v && setLineView(v)}
              size="small"
            >
              <ToggleButton value="daily">Daily</ToggleButton>
              <ToggleButton value="monthly">Monthly</ToggleButton>
              <ToggleButton value="yearly">Yearly</ToggleButton>
            </ToggleButtonGroup>
          </Stack>
          <Stack direction="row" spacing={2}>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <Box sx={{ width: 12, height: 12, borderRadius: 0.5, bgcolor: primaryLight }} />
              <Typography variant="caption">Page View</Typography>
            </Stack>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <Box sx={{ width: 12, height: 12, borderRadius: 0.5, bgcolor: primaryColor }} />
              <Typography variant="caption">Unique Visitor</Typography>
            </Stack>
          </Stack>
        </Stack>
        <LineChart
          xAxis={[{ scaleType: "point", data: months, disableLine: true, disableTicks: true }]}
          series={[
            {
              data: lineChartData.pageViews,
              label: "Page View",
              color: primaryLight,
              showMark: false,
              curve: "linear",
              area: true,
            },
            {
              data: lineChartData.uniqueVisitors,
              label: "Unique Visitor",
              color: primaryColor,
              showMark: false,
              curve: "linear",
              area: true,
            },
          ]}
          height={261}
          grid={{ horizontal: true }}
          margin={{ top: 25, right: 0, bottom: -4, left: 0 }}
          yAxis={[{ disableLine: true, disableTicks: true }]}
          hideLegend
          sx={{
            "& .MuiLineElement-root": { strokeWidth: 2 },
            "& .MuiAreaElement-root": { opacity: 0.15 },
          }}
        />
      </MainCard>

      {/* Bar Chart */}
      <MainCard>
        <Stack sx={{ gap: 2 }}>
          <Stack
            direction="row"
            sx={{ justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}
          >
            <Box>
              <Typography variant="h5">Bar Chart</Typography>
              <Typography variant="body2" color="text.secondary">
                Monitor visitor behavior to enhance user experience and retention.
              </Typography>
            </Box>
            <ToggleButtonGroup
              value={barView}
              exclusive
              onChange={(e, v) => v && setBarView(v)}
              size="small"
            >
              <ToggleButton value="daily">Daily</ToggleButton>
              <ToggleButton value="monthly">Monthly</ToggleButton>
              <ToggleButton value="yearly">Yearly</ToggleButton>
            </ToggleButtonGroup>
          </Stack>
          <Stack direction="row" spacing={2}>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <Box sx={{ width: 12, height: 12, borderRadius: 0.5, bgcolor: primaryColor }} />
              <Typography variant="caption">Revenue ($K)</Typography>
            </Stack>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <Box sx={{ width: 12, height: 12, borderRadius: 0.5, bgcolor: primaryLight }} />
              <Typography variant="caption">Expenses ($K)</Typography>
            </Stack>
          </Stack>
        </Stack>
        <BarChart
          xAxis={[{ scaleType: "band", data: months, disableLine: true, disableTicks: true }]}
          series={[
            { data: barChartData.revenue, label: "Revenue", color: primaryColor },
            { data: barChartData.expenses, label: "Expenses", color: primaryLight },
          ]}
          height={256}
          grid={{ horizontal: true }}
          yAxis={[{ disableLine: true, disableTicks: true }]}
          borderRadius={8}
          hideLegend
          margin={{ top: 40, right: 25, bottom: -5, left: -5 }}
        />
      </MainCard>

      {/* Two Column Layout */}
      <Grid container spacing={3}>
        {/* Pie Chart - Traffic in Device */}
        <Grid size={{ xs: 12, md: 6 }}>
          <MainCard sx={{ height: "100%" }}>
            <Stack sx={{ gap: 2.5 }}>
              <Typography variant="h5">Traffic in Device</Typography>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <PieChart
                  series={[
                    {
                      data: pieChartData,
                      innerRadius: 50,
                      outerRadius: 100,
                      paddingAngle: 2,
                      cornerRadius: 4,
                      highlightScope: { fade: "global", highlight: "item" },
                    },
                  ]}
                  height={220}
                  width={280}
                  slotProps={{ legend: { hidden: true } }}
                />
              </Box>
              <Stack spacing={1}>
                {pieChartData.map((item) => (
                  <Stack
                    key={item.id}
                    direction="row"
                    sx={{ justifyContent: "space-between", alignItems: "center" }}
                  >
                    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: 0.5,
                          bgcolor:
                            item.id === 0
                              ? primaryColor
                              : item.id === 1
                                ? primaryLight
                                : theme.palette.grey[400],
                        }}
                      />
                      <Typography variant="body2">{item.label}</Typography>
                    </Stack>
                    <Typography variant="body2" fontWeight={600}>
                      {item.value}%
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </MainCard>
        </Grid>

        {/* Gauge Charts */}
        <Grid size={{ xs: 12, md: 6 }}>
          <MainCard sx={{ height: "100%" }}>
            <Stack sx={{ gap: 2.5 }}>
              <Typography variant="h5">Performance Metrics</Typography>
              <Grid container spacing={2}>
                {[
                  { label: "CTR", value: 3.2, max: 5 },
                  { label: "CVR", value: 1.8, max: 5 },
                  { label: "ROAS", value: 4.5, max: 10 },
                  { label: "Quality", value: 8.2, max: 10 },
                ].map((gauge, index) => (
                  <Grid size={6} key={index}>
                    <Stack sx={{ alignItems: "center" }} spacing={1}>
                      <Gauge
                        width={100}
                        height={100}
                        value={(gauge.value / gauge.max) * 100}
                        sx={{
                          "& .MuiGauge-valueText text": {
                            fontSize: 16,
                            fontWeight: 600,
                            fill: primaryColor,
                          },
                          "& .MuiGauge-referenceArc": { fill: `${primaryColor}20` },
                          "& .MuiGauge-valueArc": { fill: primaryColor },
                        }}
                        text={`${gauge.value}`}
                        innerRadius="70%"
                        outerRadius="100%"
                      />
                      <Typography variant="body2" color="text.secondary">
                        {gauge.label}
                      </Typography>
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </Stack>
          </MainCard>
        </Grid>
      </Grid>

      {/* Performance Chart */}
      <MainCard>
        <Stack sx={{ gap: 2 }}>
          <Box>
            <Typography variant="h5">Sales Performance</Typography>
            <Typography variant="body2" color="text.secondary">
              Total sales growth and target comparison
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <Box sx={{ width: 12, height: 12, borderRadius: 0.5, bgcolor: primaryColor }} />
              <Typography variant="caption">Sales Growth</Typography>
            </Stack>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <Box sx={{ width: 12, height: 12, borderRadius: 0.5, bgcolor: primaryLight }} />
              <Typography variant="caption">Target</Typography>
            </Stack>
          </Stack>
        </Stack>
        <LineChart
          xAxis={[{ scaleType: "point", data: months, disableLine: true, disableTicks: true }]}
          series={[
            {
              data: [10, 25, 24, 38, 29, 40.5, 28.5, 24.5, 28.5, 22, 28, 37.5],
              label: "Sales Growth",
              color: primaryColor,
              showMark: false,
              curve: "linear",
            },
            {
              data: [10, 17, 19, 25, 24, 26, 17, 20, 11, 14, 12, 23],
              label: "Target",
              color: primaryLight,
              showMark: false,
              curve: "linear",
            },
          ]}
          height={255}
          grid={{ horizontal: true }}
          yAxis={[
            {
              disableLine: true,
              disableTicks: true,
              valueFormatter: (value) =>
                Number(value) > 999 ? `${(Number(value) / 1000).toLocaleString()}k` : String(value),
            },
          ]}
          hideLegend
          margin={{ top: 40, right: 25, bottom: -5, left: -5 }}
          sx={{ "& .MuiLineElement-root": { strokeWidth: 2 } }}
        />
      </MainCard>
    </Stack>
  );
}

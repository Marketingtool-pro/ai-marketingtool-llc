import { useState } from "react";

// @mui
import { useTheme } from "@mui/material/styles";
import { LineChart } from "@mui/x-charts-pro/LineChart";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";

// @project
import { TabsType, ViewMode } from "@/enum";
import MainCard from "@/components/MainCard";
import Legend from "@/components/third-party/chart/Legend";

// @icons
import { IconArrowUpRight, IconChevronRight } from "@tabler/icons-react";

// @types

/***************************  CHART - DATA  ***************************/

const yearlyData = {
  salesData: new Array(12).fill(0),
  targetData: new Array(12).fill(0),
};

const monthlyData = {
  salesData: new Array(12).fill(0),
  targetData: new Array(12).fill(0),
};

const dailyData = {
  salesData: new Array(7).fill(0),
  targetData: new Array(7).fill(0),
};

const xLabelsDaily = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const xLabelsMonthly = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const xLabelsYearly = [2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012];
const timeFilter = ["Daily", "Monthly", "Yearly"];

const xLabelsMapping = {
  [ViewMode.MONTHLY]: xLabelsMonthly,
  [ViewMode.DAILY]: xLabelsDaily,
  [ViewMode.YEARLY]: xLabelsYearly,
};

const dataMap = {
  [ViewMode.MONTHLY]: monthlyData,
  [ViewMode.DAILY]: dailyData,
  [ViewMode.YEARLY]: yearlyData,
};

/***************************  PERFORMANCE - CHART   ***************************/

export default function AnalyticsPerformanceChart({ data }) {
  const theme = useTheme();

  const [view, setView] = useState(ViewMode.MONTHLY);
  const [visibilityOption, setVisibilityOption] = useState({
    sales: true,
    target: true,
  });

  const handleViewChange = (_event, newValue) => {
    setView(newValue);
  };

  const toggleVisibility = (id) => {
    setVisibilityOption((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const xLabels = xLabelsMapping[view] || xLabelsYearly;

  // Use real data from API if available, otherwise use defaults (zeros)
  const chartData = data?.[view] || dataMap[view];

  const seriesData = [
    {
      data: chartData.revenue || chartData.salesData,
      label: "Revenue Trend",
      id: "sales",
      color: theme.vars.palette.primary.main,
      visible: visibilityOption["sales"],
    },
    {
      data: chartData.budget || chartData.targetData,
      label: "Budget Allocation",
      id: "target",
      color: theme.vars.palette.primary.light,
      visible: visibilityOption["target"],
    },
  ];

  const visibleSeries = seriesData.filter((s) => s.visible);
  const lagendItems = seriesData.map((series) => ({
    label: series.label,
    color: series.color,
    visible: series.visible,
    id: series.id,
  }));

  // Dynamic styles for visible series
  const dynamicSeriesStyles = visibleSeries.reduce((acc, series) => {
    acc[`& .MuiLineElement-series-${series.id}`] = {
      markerEnd: `url(#${series.id})`,
    };
    return acc;
  }, {});

  return (
    <MainCard>
      <Stack sx={{ gap: 3.75 }}>
        <Stack
          direction="row"
          sx={{ alignItems: "end", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}
        >
          <Stack sx={{ gap: 0.5 }}>
            <Stack direction="row" sx={{ gap: 0.25, alignItems: "end" }}>
              <Typography variant="h4" sx={{ fontWeight: 400 }}>
                $0
              </Typography>
              <Chip
                label="0%"
                variant="text"
                size="small"
                icon={<IconArrowUpRight />}
                color="success"
              />
            </Stack>
            <Typography variant="caption" sx={{ color: "grey.700" }}>
              Revenue trend vs budget allocation — connect accounts to see real data
            </Typography>
          </Stack>
          <Tabs
            value={view}
            onChange={handleViewChange}
            aria-label="filter tabs"
            type={TabsType.SEGMENTED}
            sx={{ width: "fit-content" }}
          >
            {timeFilter.map((filter, index) => (
              <Tab label={filter} value={filter} key={index} />
            ))}
          </Tabs>
        </Stack>
        <Legend items={lagendItems} onToggle={toggleVisibility} />
      </Stack>
      <LineChart
        sx={{ "& .MuiLineElement-root": { strokeWidth: 2 }, ...dynamicSeriesStyles }}
        height={255}
        series={visibleSeries.map((series) => ({ ...series, showMark: false, curve: "linear" }))}
        xAxis={[{ scaleType: "point", data: xLabels, disableLine: true, disableTicks: true }]}
        yAxis={[
          {
            disableLine: true,
            disableTicks: true,
            min: 0,
            max: visibleSeries.every((s) => s.data.every((v) => v === 0)) ? 1000 : undefined,
            valueFormatter: (value) =>
              Number(value) > 999 ? `${(Number(value) / 1000).toLocaleString()}k` : String(value),
          },
        ]}
        hideLegend
        grid={{ horizontal: true }}
        margin={{ top: 40, right: 20, bottom: -4, left: -8 }}
      >
        <defs>
          {visibleSeries.map((series, index) => (
            <marker
              id={series.id}
              key={index}
              viewBox="0 0 20 20"
              refX="15"
              refY="12"
              markerWidth="10"
              markerHeight="10"
              orient="auto-start-reverse"
            >
              <IconChevronRight color={series.color} />
            </marker>
          ))}
        </defs>
      </LineChart>
    </MainCard>
  );
}

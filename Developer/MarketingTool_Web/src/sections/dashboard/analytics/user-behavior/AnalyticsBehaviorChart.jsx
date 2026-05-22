import { useState } from "react";

// @mui
import { useTheme } from "@mui/material/styles";
import { useItemTooltip } from "@mui/x-charts-pro";
import { BarChart } from "@mui/x-charts-pro/BarChart";
import { AdapterDateFns } from "@mui/x-date-pickers-pro/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers-pro/LocalizationProvider";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

// @project
import MainCard from "@/components/MainCard";
import { ItemTooltip } from "@/components/third-party/chart/ItemTooltip";
import CustomTooltip from "@/components/third-party/chart/CustomTooltip";
import Legend from "@/components/third-party/chart/Legend";

// @assets
import { IconDownload } from "@tabler/icons-react";

// @types

const xAxisData = [
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

/**************************** CHART - CUSTOM TOOLTIP ********* */

function TooltipWrapper() {
  const tooltipData = useItemTooltip();
  if (!tooltipData) {
    return null;
  }

  const { formattedValue, label, identifier } = tooltipData;

  return (
    <CustomTooltip
      counter={formattedValue}
      groupLabel={label}
      label={xAxisData[identifier.dataIndex]}
    />
  );
}

/***************************  USER BEHAVIOR - CHART  ***************************/

export default function AnalyticsBehaviorChart({ data }) {
  const theme = useTheme();

  const [barchart, setBarchart] = useState({
    active_user: true,
    inactive_user: true,
  });

  const toggleVisibility = (id) => {
    setBarchart((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Define the series data with the SeriesData interface
  const seriesData = [
    {
      data: data?.active || new Array(12).fill(0),
      label: "Active User",
      id: "active_user",
      color: theme.vars.palette.primary.main,
      visible: barchart["active_user"],
    },
    {
      data: data?.inactive || new Array(12).fill(0),
      label: "Inactive User",
      id: "inactive_user",
      color: theme.vars.palette.primary.light,
      visible: barchart["inactive_user"],
    },
  ];

  const lagendItems = seriesData.map((series) => ({
    label: series.label,
    color: series.color,
    visible: series.visible,
    id: series.id,
  }));
  const visibleSeries = seriesData.filter((s) => s.visible);

  return (
    <MainCard>
      <Stack sx={{ gap: 3.75 }}>
        <Stack
          direction="row"
          sx={{ alignItems: "end", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}
        >
          <Stack sx={{ gap: 0.5 }}>
            <Typography variant="h4">User Overview</Typography>
            <Typography variant="caption" color="grey.700">
              Monitor visitor behavior to enhance user experience and retention.
            </Typography>
          </Stack>
          <Stack direction="row" sx={{ gap: 1.5, width: { xs: 1, sm: "auto" } }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                format="dd-MMM-yyyy"
                defaultValue={new Date()}
                slotProps={{ textField: { fullWidth: true, sx: { minWidth: 180 } } }}
              />
            </LocalizationProvider>
            <IconButton variant="outlined" color="secondary" size="small" aria-label="Download">
              <IconDownload size={16} />
            </IconButton>
          </Stack>
        </Stack>
        <Legend items={lagendItems} onToggle={toggleVisibility} />
      </Stack>

      <BarChart
        xAxis={[{ scaleType: "band", data: xAxisData, disableLine: true, disableTicks: true }]}
        grid={{ horizontal: true }}
        series={visibleSeries}
        yAxis={[
          {
            disableLine: true,
            disableTicks: true,
            min: 0,
            max: visibleSeries.every((s) => s.data.every((v) => v === 0)) ? 1000 : undefined,
            tickInterval: [0, 200, 400, 600, 800, 1000],
          },
        ]}
        colors={seriesData.map((series) => series.color)}
        height={256}
        borderRadius={8}
        slots={{
          tooltip: () => (
            <ItemTooltip>
              <TooltipWrapper />
            </ItemTooltip>
          ),
        }}
        slotProps={{ tooltip: { trigger: "item" } }}
        hideLegend
        margin={{ top: 40, right: 0, bottom: -4, left: 0 }}
      />
    </MainCard>
  );
}

// @mui
import Grid from "@mui/material/Grid";
import { DateCalendar } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers-pro/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers-pro/LocalizationProvider";

// @project
import PresentationCard from "@/components/cards/PresentationCard";
import PageAnimateWrapper from "@/components/PageAnimateWrapper";

/***************************  PLUGINES - CALENDAR  ***************************/

export default function Calendar() {
  return (
    <PageAnimateWrapper>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <PresentationCard title="Static Calendar">
              <DateCalendar />
            </PresentationCard>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <PresentationCard title="Date Picker">
              <DatePicker />
            </PresentationCard>
          </Grid>
        </Grid>
      </LocalizationProvider>
    </PageAnimateWrapper>
  );
}

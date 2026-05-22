import PropTypes from "prop-types";
import { useState } from "react";

// @mui
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Fade from "@mui/material/Fade";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Popper from "@mui/material/Popper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import { AdapterDateFns } from "@mui/x-date-pickers-pro/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers-pro/LocalizationProvider";

// @third-party
import { format } from "date-fns";
import { AnimatePresence, motion } from "motion/react";
import { Controller, useForm } from "react-hook-form";

// @project
import { handleUserFilter, initialUserFilter, useGetUserFilter } from "../api";
import MainCard from "@/components/MainCard";
import { varSlide } from "@/components/third-party/motion/animate/dialog";
import SimpleBar from "@/components/third-party/SimpleBar";

// @types
import { Roles, Status } from "../type";

// @assets
import { IconFilter, IconX } from "@tabler/icons-react";

const roleOptions = [Roles.ADMIN, Roles.DEVELOPER, Roles.ENGINEER, Roles.SUPER_ADMIN];
const statusOptions = [Status.PENDING, Status.ACTIVE, Status.REPORTED, Status.BLOCKED];
const chipProps = {
  variant: "outlined",
  size: "small",
  sx: { color: "text.disabled" },
};

const defaultFilter = initialUserFilter.columnFilters;

/***************************  FILTER - FORM  ***************************/

function UserFilterForm({ defaultValues, setDefaultValues, setFilterAnchorEl, maxHeight }) {
  const theme = useTheme();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm({ defaultValues, mode: "onChange" });

  const onSubmit = (data) => {
    setDefaultValues(data);

    const filters = [];
    if (data.status?.length) filters.push({ id: "status", value: Array.from(data.status) });
    if (data.role?.length) filters.push({ id: "role", value: Array.from(data.role) });
    if (data.startDate instanceof Date || data.endDate instanceof Date)
      filters.push({ id: "createdDate", value: { start: data.startDate, end: data.endDate } });

    handleUserFilter({ columnFilters: filters, globalFilter: data.search });
    setFilterAnchorEl(null);
  };

  const selectedRoles = watch("role", []);
  const selectedStatus = watch("status", []);
  const startDate = watch("startDate");
  const endDate = watch("endDate");

  const renderCheckboxGroup = (options, selected, name) => (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormGroup sx={{ gap: 0.375 }}>
          {options.map((item) => {
            return (
              <FormControlLabel
                key={item}
                control={
                  <Checkbox
                    size="medium"
                    checked={selected.includes(item)}
                    onChange={() =>
                      field.onChange(
                        selected.includes(item)
                          ? selected.filter((v) => v !== item)
                          : [...selected, item],
                      )
                    }
                  />
                }
                label={item}
              />
            );
          })}
        </FormGroup>
      )}
    />
  );

  const renderDatePicker = (name, label, compareDate, compareName) => (
    <Box sx={{ width: 1 }}>
      <InputLabel sx={(theme) => ({ ...theme.typography.caption1 })}>{label}</InputLabel>
      <Controller
        name={name}
        control={control}
        rules={{
          validate: (value) => {
            if (
              value &&
              compareDate &&
              ((name === "startDate" && value.getTime() > compareDate.getTime()) ||
                (name === "endDate" && value.getTime() < compareDate.getTime()))
            ) {
              return `${label} must be ${name === "startDate" ? "before" : "after"} ${compareName}`;
            }
            return true;
          },
        }}
        render={({ field }) => (
          <DatePicker
            value={field.value instanceof Date && !isNaN(+field.value) ? field.value : null}
            onChange={(date) => field.onChange(date instanceof Date && !isNaN(+date) ? date : null)}
            slotProps={{
              textField: {
                fullWidth: true,
                error: !!errors[name],
                helperText: errors[name]?.message,
              },
              actionBar: { actions: ["clear"] },
            }}
          />
        )}
      />
    </Box>
  );

  return (
    <form>
      <SimpleBar sx={{ minHeight: 280, maxHeight: maxHeight - 75, height: 1 }}>
        <Box sx={{ px: 1, py: 2 }}>
          <Stack sx={{ gap: 1.5 }}>
            <OutlinedInput fullWidth placeholder="Search filters" {...register("search")} />

            <Box px={1}>
              <Stack
                direction="row"
                sx={{ alignItems: "center", justifyContent: "space-between", py: 1 }}
              >
                <Typography variant="caption1" color="text.disabled">
                  Roles
                </Typography>
                <Chip
                  label={`${selectedRoles.length} Plan${selectedRoles.length > 1 ? "s" : ""}`}
                  {...chipProps}
                />
              </Stack>
              {renderCheckboxGroup(roleOptions, selectedRoles, "role")}
            </Box>

            <Box px={1}>
              <Stack
                direction="row"
                sx={{ alignItems: "center", justifyContent: "space-between", py: 1 }}
              >
                <Typography variant="caption1" color="text.disabled">
                  Status
                </Typography>
                <Chip
                  label={`${selectedStatus.length} Status${selectedStatus.length > 1 ? "es" : ""}`}
                  {...chipProps}
                />
              </Stack>
              {renderCheckboxGroup(statusOptions, selectedStatus, "status")}
            </Box>

            <Stack sx={{ gap: 2, p: 1 }}>
              <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
                <Typography variant="caption1" color="text.disabled">
                  Date
                </Typography>
                {(startDate || endDate) && (
                  <Chip
                    label={`${startDate instanceof Date ? format(startDate, "dd MMM") : "xxx"} - ${endDate instanceof Date ? format(endDate, "dd MMM") : "xxx"}`}
                    {...chipProps}
                  />
                )}
              </Stack>
              <Stack direction="row" sx={{ gap: 1.5, alignItems: "center" }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  {renderDatePicker("startDate", "From", endDate ?? null, "endDate")}
                  {renderDatePicker("endDate", "To", startDate ?? null, "startDate")}
                </LocalizationProvider>
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </SimpleBar>

      <Stack
        direction="row"
        sx={{
          width: 1,
          justifyContent: "space-between",
          gap: 2,
          p: 2,
          borderTop: `1px solid ${theme.vars.palette.divider}`,
        }}
      >
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => {
            const defaults = {
              search: initialUserFilter.globalFilter || "",
              role: defaultFilter?.find((f) => f.id === "role")?.value || [],
              status: defaultFilter?.find((f) => f.id === "status")?.value || [],
              // @ts-expect-error date
              startDate: defaultFilter?.find((f) => f.id === "createdDate")?.value?.start || null,
              // @ts-expect-error date
              endDate: defaultFilter?.find((f) => f.id === "createdDate")?.value?.end || null,
            };
            Object.entries(defaults).forEach(([k, v]) => setValue(k, v, { shouldDirty: true }));
          }}
        >
          Reset
        </Button>
        <Button variant="contained" onClick={handleSubmit(onSubmit)} disabled={!isDirty}>
          Apply
        </Button>
      </Stack>
    </form>
  );
}

/***************************  TABLE - FILTER  ***************************/

export default function FilterSection({ maxHeight }) {
  const theme = useTheme();
  const onlyXS = useMediaQuery(theme.breakpoints.only("xs"));

  const { userFilter } = useGetUserFilter();
  const { columnFilters, globalFilter } = userFilter || {};

  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const open = Boolean(filterAnchorEl);

  const filterValues = {
    search: globalFilter || "",
    role: columnFilters?.find((f) => f.id === "role")?.value || [],
    status: columnFilters?.find((f) => f.id === "status")?.value || [],
    // @ts-expect-error startDate
    startDate: columnFilters?.find((f) => f.id === "createdDate")?.value?.start || null,
    // @ts-expect-error endDate
    endDate: columnFilters?.find((f) => f.id === "createdDate")?.value?.end || null,
  };

  const [defaultValues, setDefaultValues] = useState(filterValues);

  const handleActionClick = (event) => {
    // manage default values - according to removed chip from tooltip
    setDefaultValues(filterValues);
    setFilterAnchorEl(open ? null : event.currentTarget);
  };

  return (
    <>
      <Button
        variant="text"
        color="secondary"
        startIcon={<IconFilter size={16} />}
        sx={{
          display: { xs: "none", sm: "inline-flex" },
          color: "text.secondary",
          "& svg": { color: "inherit" },
        }}
        onClick={handleActionClick}
      >
        Filter
      </Button>
      <IconButton
        size="small"
        color="secondary"
        sx={{
          display: { xs: "block", sm: "none" },
          color: "text.secondary",
          "& svg": { color: "inherit" },
        }}
        onClick={handleActionClick}
        aria-label="filter"
      >
        <IconFilter size={16} />
      </IconButton>
      <AnimatePresence>
        {open && (
          <Popper
            placement="bottom-end"
            id={open ? "Filter-popper" : undefined}
            open={open}
            anchorEl={filterAnchorEl}
            transition
            popperOptions={{
              modifiers: [
                { name: "offset", options: { offset: [onlyXS ? 12 : 22, onlyXS ? 12 : 0] } },
              ],
            }}
          >
            {({ TransitionProps }) => (
              <Fade in={open} {...TransitionProps}>
                <motion.div
                  variants={varSlide("slideInDown", { distance: 20 })}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <MainCard
                    sx={{
                      p: 0,
                      borderRadius: 3,
                      boxShadow: theme.vars.customShadows.tooltip,
                      width: { xs: "calc(100vw - 32px)", sm: 352 },
                    }}
                  >
                    <ClickAwayListener onClickAway={() => setFilterAnchorEl(null)}>
                      <Box>
                        <Stack
                          direction="row"
                          sx={{
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 2,
                            p: 2,
                            borderBottom: `1px solid ${theme.vars.palette.divider}`,
                          }}
                        >
                          <Typography variant="h6">Filter</Typography>
                          <IconButton
                            variant="outlined"
                            size="small"
                            color="secondary"
                            aria-label="close"
                            onClick={handleActionClick}
                          >
                            <IconX size={16} />
                          </IconButton>
                        </Stack>
                        <UserFilterForm
                          {...{ defaultValues, setDefaultValues, setFilterAnchorEl, maxHeight }}
                        />
                      </Box>
                    </ClickAwayListener>
                  </MainCard>
                </motion.div>
              </Fade>
            )}
          </Popper>
        )}
      </AnimatePresence>
    </>
  );
}

UserFilterForm.propTypes = {
  defaultValues: PropTypes.any,
  setDefaultValues: PropTypes.func,
  setFilterAnchorEl: PropTypes.func,
  maxHeight: PropTypes.number,
};

FilterSection.propTypes = { maxHeight: PropTypes.number };

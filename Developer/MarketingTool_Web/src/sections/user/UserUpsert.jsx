import PropTypes from "prop-types";
import { useEffect, useTransition } from "react";

// @mui
import { AdapterDateFns } from "@mui/x-date-pickers-pro/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers-pro/LocalizationProvider";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

// @third-party
import { enqueueSnackbar } from "notistack";
import { useForm, Controller } from "react-hook-form";

// @project
import { createUser, updateUser } from "./api";
import { rolesData } from "./data/roles";
import Contact from "@/components/Contact";
import Modal from "@/components/Modal";
import AvatarUpload from "@/components/third-party/dropzone/AvatarUpload";
import { ModalSize } from "@/enum";
import {
  emailSchema,
  firstNameSchema,
  lastNameSchema,
  usernameSchema,
} from "@/utils/validation-schema/common";

// @assets
import { IconMail } from "@tabler/icons-react";

// @types
import { Roles, Status } from "./type";

const roles = rolesData;
const statusOptions = ["Active", "Pending", "Reported", "Block"];

const initialData = {
  avatar: "",
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  zipCode: "",
  address: "",
  dialCode: "+1",
  contact: "",
  role: Roles.DEVELOPER,
  status: Status.PENDING,
  createdDate: new Date(),
};

/*************************** MODAL - NEW USER  ***************************/

export default function UserUpsert({ open, onClose, userData }) {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    setValue,
    formState: { errors, isDirty, dirtyFields, defaultValues },
  } = useForm({
    defaultValues: initialData,
  });

  const onSubmit = async ({
    avatar,
    firstName,
    lastName,
    username,
    email,
    zipCode,
    address,
    dialCode,
    contact,
    role,
    status,
    createdDate,
  }) => {
    const formData = new FormData();

    formData.append("avatar", avatar);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("zipCode", zipCode || "");
    formData.append("address", address || "");
    formData.append("dialCode", dialCode);
    formData.append("contact", contact);
    formData.append("role", role);
    formData.append("status", status);
    formData.append("createdDate", createdDate.toString());

    if (userData) {
      formData.append("id", userData.id);
    }

    startTransition(async () => {
      const { error } = userData ? await updateUser(formData) : await createUser(formData);

      if (error) {
        enqueueSnackbar(error, { variant: "error" });
        return;
      }

      enqueueSnackbar(`User has been ${userData ? "updated" : "created"}.`, {
        variant: "success",
      });
      onClose();
    });
  };

  //if form data is passed, set the form values
  useEffect(() => {
    if (open) {
      const formInitData = userData
        ? {
            avatar: userData.avatar,
            firstName: userData.firstName,
            lastName: userData.lastName,
            username: userData.username,
            email: userData.email,
            zipCode: userData.zipCode,
            address: userData.address,
            dialCode: userData.dialCode,
            contact: userData.contact,
            role: userData.role,
            status: userData.status,
            createdDate: userData.createdDate,
          }
        : initialData;
      reset(formInitData);
    }
  }, [open, userData, reset]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      maxWidth={ModalSize.MD}
      header={{
        title: userData ? "Edit User" : "Add New User",
        subheader: "Existing or new user custom settings and permissions.",
        closeButton: true,
      }}
      onFormSubmit={handleSubmit(onSubmit)}
      modalContent={
        <Stack sx={{ gap: 3 }}>
          <Stack sx={{ gap: 2 }}>
            <Typography variant="subtitle1">Personal Detail</Typography>
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12 }} sx={{ mb: 1 }}>
                <AvatarUpload
                  control={control}
                  showDiscardAction={!!(userData && dirtyFields.avatar)}
                  initialAvatar={defaultValues?.avatar}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <InputLabel required>First Name</InputLabel>
                <OutlinedInput
                  fullWidth
                  placeholder="ex. John"
                  error={errors.firstName && Boolean(errors.firstName)}
                  {...register("firstName", firstNameSchema)}
                />
                {errors.firstName?.message && (
                  <FormHelperText error>{errors.firstName?.message}</FormHelperText>
                )}
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <InputLabel required>Last Name</InputLabel>
                <OutlinedInput
                  fullWidth
                  placeholder="ex. Doe"
                  error={errors.lastName && Boolean(errors.lastName)}
                  {...register("lastName", lastNameSchema)}
                />
                {errors.lastName?.message && (
                  <FormHelperText error>{errors.lastName?.message}</FormHelperText>
                )}
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <InputLabel required>Username</InputLabel>
                <OutlinedInput
                  placeholder="ex. john_doe"
                  fullWidth
                  error={errors.username && Boolean(errors.username)}
                  {...register("username", usernameSchema)}
                  aria-describedby="outlined-username"
                  slotProps={{ input: { "aria-label": "username" } }}
                />
                {errors.username?.message && (
                  <FormHelperText error>{errors.username?.message}</FormHelperText>
                )}
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <InputLabel required>Email</InputLabel>
                <OutlinedInput
                  placeholder="example@gmail.com"
                  fullWidth
                  error={errors.email && Boolean(errors.email)}
                  {...register("email", emailSchema)}
                  startAdornment={
                    <InputAdornment position="start">
                      <IconMail />
                    </InputAdornment>
                  }
                  aria-describedby="outlined-email"
                  slotProps={{ input: { "aria-label": "email" } }}
                />
                {errors.email?.message && (
                  <FormHelperText error>{errors.email?.message}</FormHelperText>
                )}
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <InputLabel required>Contact Us</InputLabel>
                <Contact
                  fullWidth
                  dialCode={watch("dialCode")}
                  onCountryChange={(data) => setValue("dialCode", data.dialCode)}
                  control={control}
                  isError={errors.contact && Boolean(errors.contact)}
                />
                {errors.contact?.message && (
                  <FormHelperText error>{errors.contact?.message}</FormHelperText>
                )}
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Box sx={{ width: 1 }}>
                    <InputLabel required>Joining Date</InputLabel>
                    <Controller
                      name="createdDate"
                      control={control}
                      rules={{
                        required: "Joining Date is required",
                      }}
                      render={({ field }) => {
                        const dateValue = field.value ? new Date(field.value) : null;

                        return (
                          <DatePicker
                            value={dateValue}
                            onChange={(date) => {
                              field.onChange(date);
                            }}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                error: !!errors.createdDate,
                                helperText: errors.createdDate?.message,
                              },
                              actionBar: { actions: ["clear"] },
                            }}
                          />
                        );
                      }}
                    />
                  </Box>
                </LocalizationProvider>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <InputLabel>ZipCode</InputLabel>
                <OutlinedInput fullWidth placeholder="514698" {...register("zipCode")} />
              </Grid>
              <Grid size={12}>
                <InputLabel>Address</InputLabel>
                <OutlinedInput
                  placeholder="Enter a address..."
                  multiline
                  minRows={4}
                  aria-describedby="outlined-address"
                  fullWidth
                  {...register("address")}
                />
              </Grid>
              <Grid size={12}>
                <InputLabel>Status</InputLabel>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup row aria-labelledby="radio-group-status" {...field}>
                      {statusOptions.map((item, index) => (
                        <FormControlLabel
                          key={index}
                          value={item}
                          control={<Radio />}
                          label={item}
                        />
                      ))}
                    </RadioGroup>
                  )}
                />
              </Grid>
            </Grid>
          </Stack>
          <Stack sx={{ gap: 2 }}>
            <Typography variant="subtitle1">Roles</Typography>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  aria-labelledby="radio-group-roles"
                  {...field}
                  sx={{ gap: 2.5, alignItems: "flex-start" }}
                >
                  {roles.map((item, index) => (
                    <FormControlLabel
                      key={index}
                      control={<Radio value={item.title} sx={{ mt: -0.5 }} />}
                      label={
                        <Stack sx={{ gap: 0.5 }}>
                          <Typography variant="subtitle2">{item.title}</Typography>
                          <Typography variant="body2" sx={{ color: "text.secondary" }}>
                            {item.content}
                          </Typography>
                        </Stack>
                      }
                      sx={{ alignItems: "flex-start" }}
                    />
                  ))}
                </RadioGroup>
              )}
            />
          </Stack>
        </Stack>
      }
      footer={
        <Stack direction="row" sx={{ width: 1, justifyContent: "space-between", gap: 2 }}>
          <Button variant="outlined" color="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            type="submit"
            disabled={!isDirty || isPending}
            loading={isPending}
            loadingPosition="end"
          >
            {userData ? "Update User" : "Create User"}
          </Button>
        </Stack>
      }
    />
  );
}

UserUpsert.propTypes = { open: PropTypes.bool, onClose: PropTypes.func, userData: PropTypes.any };

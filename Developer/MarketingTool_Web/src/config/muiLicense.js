import { LicenseInfo } from "@mui/x-license";

const MUI_X_LICENSE_KEY =
  import.meta.env.VITE_MUI_X_LICENSE_KEY || import.meta.env.VITE_APP_MUI_X_LICENSE_KEY || "";

if (MUI_X_LICENSE_KEY) {
  LicenseInfo.setLicenseKey(MUI_X_LICENSE_KEY);
}

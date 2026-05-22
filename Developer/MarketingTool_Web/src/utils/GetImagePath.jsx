// @mui
import { useColorScheme } from '@mui/material/styles';

// @types

/***************************  IMAGE - TYPE IDENTIFY ***************************/

function isImageComponentProps(value) {
  return value.light !== undefined && value.dark !== undefined;
}

/***************************  COMMON - IMAGE PATH  ***************************/

export default function GetImagePath(image) {
  const { colorScheme } = useColorScheme();

  return isImageComponentProps(image) ? image[colorScheme || 'light'] : image;
}

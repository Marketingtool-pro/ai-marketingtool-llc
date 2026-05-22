// @icons
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

/***************************  OVERRIDES - DATE CALENDAR  ***************************/

export default function DateCalendar() {
  return {
    MuiDateCalendar: {
      defaultProps: {
        slots: {
          leftArrowIcon: IconChevronLeft,
          rightArrowIcon: IconChevronRight
        }
      }
    }
  };
}

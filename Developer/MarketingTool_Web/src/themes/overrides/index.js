// @third-party
import { merge } from 'lodash-es';

// @project
import Alert from './Alert';
import Autocomplete from './Autocomplete';
import Avatar from './Avatar';
import AvatarGroup from './AvatarGroup';
import Backdrop from './Backdrop';
import BarLabel from './BarLabel';
import Breadcrumbs from './Breadcrumbs';
import Button from './Button';
import Card from './Card';
import CardActions from './CardActions';
import CardContent from './CardContent';
import CardHeader from './CardHeader';
import ChartsAxis from './ChartsAxis';
import ChartsAxiasHighlight from './ChartsAxisHighlight';
import ChartsTooltip from './ChartsTooltip';
import Checkbox from './Checkbox';
import Chip from './Chip';
import DateCalendar from './DateCalendar';
import DayCalendar from './DayCalendar';
import Dialog from './Dialog';
import DialogActions from './DialogActions';
import DialogContent from './DialogContent';
import DialogTitle from './DialogTitle';
import FormControlLabel from './FormControlLabel';
import FormHelperText from './FormHelperText';
import IconButton from './IconButton';
import InputAdornment from './InputAdornment';
import InputLabel from './InputLabel';
import LinearProgress from './LinearProgress';
import ListItemButton from './ListItemButton';
import ListItemIcon from './ListItemIcon';
import ListItemText from './ListItemText';
import Menu from './Menu';
import MenuItem from './MenuItem';
import Modal from './Modal';
import OutlinedInput from './OutlinedInput';
import Pagination from './Pagination';
import PaginationItem from './PaginationItem';
import PickersArrowSwitcher from './PickersArrowSwitcher';
import PickersCalendarHeader from './PickersCalendarHeader';
import PickersDay from './PickersDay';
import PickersOutlinedInput from './PickersOutlinedInput';
import PickersPopper from './PickersPopper';
import PickersTextField from './PickersTextField';
import Popper from './Popper';
import Radio from './Radio';
import Slider from './Slider';
import Switch from './Switch';
import Tab from './Tab';
import TableCell from './TableCell';
import TableHead from './TableHead';
import TableRow from './TableRow';
import Tabs from './Tabs';
import Tooltip from './Tooltip';

/***************************  OVERRIDES - MAIN  ***************************/

export default function ComponentsOverrides(theme) {
  return merge(
    Alert(theme),
    Autocomplete(theme),
    Avatar(theme),
    AvatarGroup(),
    Backdrop(theme),
    BarLabel(theme),
    Breadcrumbs(theme),
    Button(theme),
    Card(theme),
    CardActions(theme),
    CardContent(),
    CardHeader(theme),
    ChartsAxis(theme),
    ChartsAxiasHighlight(theme),
    ChartsTooltip(theme),
    Checkbox(theme),
    Chip(theme),
    DateCalendar(),
    DayCalendar(theme),
    Dialog(theme),
    DialogActions(),
    DialogContent(),
    DialogTitle(),
    FormControlLabel(theme),
    FormHelperText(theme),
    IconButton(theme),
    InputAdornment(theme),
    InputLabel(theme),
    LinearProgress(theme),
    ListItemButton(theme),
    ListItemIcon(),
    ListItemText(),
    Menu(theme),
    MenuItem(theme),
    Modal(),
    OutlinedInput(theme),
    Pagination(theme),
    PaginationItem(theme),
    PickersArrowSwitcher(theme),
    PickersCalendarHeader(theme),
    PickersDay(theme),
    PickersOutlinedInput(theme),
    PickersPopper(theme),
    PickersTextField(),
    Popper(),
    Radio(theme),
    Slider(theme),
    Switch(theme),
    Tab(theme),
    TableCell(theme),
    TableHead(theme),
    TableRow(theme),
    Tabs(theme),
    Tooltip(theme)
  );
}

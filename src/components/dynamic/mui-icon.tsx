import {
  Home,
  BubbleChart,
  SupervisorAccountRounded,
  WarningAmber,
} from '@material-ui/icons';
import { SvgIconType } from '@/types/elements';

const Icons = {
  Home,
  BubbleChart,
  SupervisorAccountRounded,
};

type IconKey = keyof typeof Icons;

export default function MuiIcon(icon: string): SvgIconType {
  const Icon = Icons[icon as IconKey];

  if (!Icon) return WarningAmber;

  return Icon;
}

import {
  Home,
  BubbleChart,
  SupervisorAccountRounded,
  WarningAmber,
} from '@mui/icons-material';
import { SvgIconType } from '@/types/elements';

const Icons = {
  Home,
  BubbleChart,
  SupervisorAccountRounded,
};

type IconKey = keyof typeof Icons;
type GetIcon = (icon: string) => SvgIconType;

function useMuiIcon(): GetIcon;
function useMuiIcon(icon: string): SvgIconType;
function useMuiIcon(icon?: string): SvgIconType | GetIcon {
  const getIcon = (icon: string): SvgIconType => {
    const SvgIcon = Icons[icon as IconKey];
    return SvgIcon ?? WarningAmber;
  };

  return icon ? getIcon(icon) : getIcon;
}

export default useMuiIcon;

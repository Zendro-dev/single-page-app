import Link from 'next/link';

import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  TypographyProps,
} from '@mui/material';

import { SvgIconType } from '@/types/elements';

export interface NavLinkProps {
  className?: string;
  href: string;
  icon?: SvgIconType;
  text: string;
  textProps?: TypographyProps;
}

export default function NavLink({
  className,
  href,
  icon: Icon,
  text,
  textProps,
}: NavLinkProps): React.ReactElement {
  return (
    <Link href={href} passHref>
      <ListItem className={className ?? ''} component="a" button>
        {Icon && (
          <ListItemIcon>
            <Icon />
          </ListItemIcon>
        )}
        <ListItemText
          primary={<Typography {...textProps}>{text}</Typography>}
        />
      </ListItem>
    </Link>
  );
}

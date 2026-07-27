import React from 'react';
import { Button, ButtonProps, Menu, MenuItem, MenuProps } from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import SiteLink from '@/components/site-link';
import { SvgIconType } from '@/types/elements';

interface TabMenuLink {
  label: string;
  href: string;
  icon?: SvgIconType;
}

interface TabMenuProps {
  label: string;
  links?: TabMenuLink[];
  selected?: string;
  ButtonProps?: ButtonProps;
  MenuProps?: Omit<MenuProps, 'open'>;
}

export default function TabMenu({
  links,
  ...props
}: TabMenuProps): React.ReactElement {
  // The anchor element is only ever needed once the button has actually
  // been clicked, so it's captured from the click event itself (into
  // state, causing a real re-render) rather than read from a ref during
  // render - reading ref.current while rendering can be stale/inconsistent
  // with what's on screen.
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const open = Boolean(anchorEl);

  const onButtonClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const onMenuClose = (): void => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        aria-controls={props.MenuProps?.id ?? 'tab-menu'}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        disabled={links === undefined || links.length === 0}
        id="tab-menu-button"
        onClick={onButtonClick}
        endIcon={links && links.length > 0 && <ExpandMoreIcon />}
        {...props.ButtonProps}
      >
        {props.label}
      </Button>

      {links && (
        <Menu
          anchorEl={anchorEl}
          aria-labelledby={props.ButtonProps?.id ?? 'tab-menu-button'}
          id="tab-menu"
          onClose={onMenuClose}
          open={open}
          slotProps={{
            paper: {
              style: {
                width: anchorEl?.clientWidth,
              },
            },
          }}
          {...props.MenuProps}
        >
          {links.map((link) => (
            <MenuItem key={link.label} selected={props.selected === link.href}>
              <SiteLink color="inherit" underline="none" href={link.href}>
                {link.icon && <link.icon />}
                {link.label}
              </SiteLink>
            </MenuItem>
          ))}
        </Menu>
      )}
    </>
  );
}

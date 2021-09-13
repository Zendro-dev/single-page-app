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
  const buttonRef = React.useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = React.useState(false);

  const onButtonClick = (): void => {
    setOpen(true);
  };

  const onMenuClose = (): void => {
    setOpen(false);
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
        ref={(ref) => (buttonRef.current = ref)}
        endIcon={links && links.length > 0 && <ExpandMoreIcon />}
        {...props.ButtonProps}
      >
        {props.label}
      </Button>

      {links && (
        <Menu
          anchorEl={buttonRef.current}
          aria-labelledby={props.ButtonProps?.id ?? 'tab-menu-button'}
          id="tab-menu"
          onClose={onMenuClose}
          open={open}
          PaperProps={{
            style: {
              width: buttonRef.current?.clientWidth,
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

// Ported from single-page-app's site-link.tsx. The original wrapped
// next/link's old (pre-13) API - a single child anchor plus `passHref` to
// forward the href down. react-router-dom's Link renders its own <a>
// directly, and MUI's own `component` prop is the standard way to render a
// MuiLink as a different underlying element while keeping MUI's styling -
// no wrapping/passHref dance needed.
import React, { ReactElement, Ref } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Link as MuiLink, LinkProps as MuiLinkProps } from '@mui/material';

type LinkRef = HTMLAnchorElement;
type SiteLinkProps = Omit<MuiLinkProps, 'href' | 'classes'> & { href: string };

const SiteLink = (
  { href, children, ...muiLinkProps }: SiteLinkProps,
  ref: Ref<LinkRef>
): ReactElement => (
  <MuiLink ref={ref} component={RouterLink} to={href} {...muiLinkProps}>
    {children}
  </MuiLink>
);

export default React.forwardRef<LinkRef, SiteLinkProps>(SiteLink);

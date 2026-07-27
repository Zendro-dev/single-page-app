/**
 *
 * Next/Mui link component adapted from:
 * https://gist.github.com/kachar/028b6994eb6b160e2475c1bb03e33e6a
 *
 */

import React, { ReactElement, Ref } from 'react';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import { Link as MuiLink, LinkProps as MuiLinkProps } from '@mui/material';

type LinkRef = HTMLAnchorElement;
type SiteLinkProps = Omit<MuiLinkProps, 'href' | 'classes'> & NextLinkProps;

const SiteLink = (
  {
    as,
    href,
    locale,
    replace,
    scroll,
    shallow,
    prefetch,
    children,
    ...muiLinkProps
  }: SiteLinkProps,
  ref: Ref<LinkRef>
): ReactElement => (
  // next/link's Link renders its own <a> directly (no more passHref +
  // manual-child-<a> pattern) - delegating MuiLink's own root rendering to
  // it via `component` keeps this to a single <a>, instead of nesting one
  // inside the other and triggering a hydration error.
  <MuiLink
    ref={ref}
    component={NextLink}
    as={as}
    href={href}
    locale={locale}
    prefetch={prefetch}
    replace={replace}
    scroll={scroll}
    shallow={shallow}
    {...muiLinkProps}
  >
    {children}
  </MuiLink>
);

export default React.forwardRef<LinkRef, SiteLinkProps>(SiteLink);

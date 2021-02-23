/**
 *
 * Next/Mui link component adapted from:
 * https://gist.github.com/kachar/028b6994eb6b160e2475c1bb03e33e6a
 *
 */

import React, { ReactElement, Ref } from 'react';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import { Link as MuiLink, LinkProps as MuiLinkProps } from '@material-ui/core';

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
  <NextLink
    as={as}
    href={href}
    locale={locale}
    prefetch={prefetch}
    passHref={true}
    replace={replace}
    scroll={scroll}
    shallow={shallow}
  >
    <MuiLink ref={ref} {...muiLinkProps}>
      {children}
    </MuiLink>
  </NextLink>
);

export default React.forwardRef<LinkRef, SiteLinkProps>(SiteLink);
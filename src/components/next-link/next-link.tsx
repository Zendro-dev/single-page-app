import NextLink, { LinkProps } from 'next/link';
import { PropsWithChildren, ReactElement } from 'react';

export default function Link({
  children,
  ...props
}: PropsWithChildren<LinkProps>): ReactElement {
  return (
    <NextLink {...props}>
      <a>{children}</a>
    </NextLink>
  );
}

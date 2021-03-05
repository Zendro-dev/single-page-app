import { forwardRef, ReactElement } from 'react';
import Link from 'next/link';
import Fab, { FloatButtonProps } from '../buttons/fab';

export interface FabLinkProps extends Omit<FloatButtonProps, 'ref'> {
  href: string;
}

const FabLinkRef = forwardRef<HTMLAnchorElement, FloatButtonProps>(
  function FabLink({ href, ...props }, ref) {
    return (
      <a href={href} ref={ref}>
        <Fab {...props} />
      </a>
    );
  }
);

export default function FabLink({
  href,
  ...props
}: FabLinkProps): ReactElement {
  return (
    <Link href={href} passHref>
      <FabLinkRef {...props} />
    </Link>
  );
}

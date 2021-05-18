import { forwardRef, ReactElement } from 'react';
import Link from 'next/link';
import FloatButton, { FloatButtonProps } from '@/components/float-button';

export interface FloatLinkProps extends Omit<FloatButtonProps, 'ref'> {
  href: string;
}

const FabLinkRef = forwardRef<HTMLAnchorElement, FloatButtonProps>(
  function FabLink({ href, ...props }, ref) {
    return (
      <a href={href} ref={ref}>
        <FloatButton {...props} />
      </a>
    );
  }
);

export default function FabLink({
  href,
  ...props
}: FloatLinkProps): ReactElement {
  return (
    <Link href={href} passHref>
      <FabLinkRef {...props} />
    </Link>
  );
}

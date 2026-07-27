import { forwardRef, ReactElement, Ref } from 'react';
import Link from 'next/link';
import FloatButton, { FloatButtonProps } from '@/components/float-button';

export interface FloatLinkProps extends Omit<FloatButtonProps, 'ref'> {
  href: string;
}

// next/link's Link renders its own <a> directly (no more passHref +
// manual-child-<a> pattern) - delegating FloatButton's own root rendering
// to it via `component` keeps this to a single <a>, instead of nesting a
// manually-rendered <a> inside Link's own and triggering a hydration error.
export default forwardRef<HTMLAnchorElement, FloatLinkProps>(function FabLink(
  { href, ...props },
  ref
): ReactElement {
  return (
    <FloatButton
      ref={ref as Ref<HTMLButtonElement>}
      component={Link}
      href={href}
      {...props}
    />
  );
});

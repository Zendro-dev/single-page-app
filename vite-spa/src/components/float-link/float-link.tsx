import { ReactElement } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import FloatButton, { FloatButtonProps } from '@/components/float-button';

export interface FloatLinkProps extends Omit<FloatButtonProps, 'ref'> {
  href: string;
}

export default function FabLink({ href, ...props }: FloatLinkProps): ReactElement {
  return (
    <RouterLink to={href}>
      <FloatButton {...props} />
    </RouterLink>
  );
}

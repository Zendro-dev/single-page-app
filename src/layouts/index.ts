import { NextPage } from 'next';
import { ReactElement } from 'react';

import ModelsLayout from './models';
import AppLayout from './app';

/**
 * NextPage enhanced with an optional "layout" property.
 */
export type PageWithLayout<P = Record<string, unknown>> = NextPage<P> & {
  layout?: typeof ModelsLayout;
  withLayout?: (page: ReactElement) => ReactElement;
};

export { AppLayout, ModelsLayout };

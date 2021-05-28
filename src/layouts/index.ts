import { NextPage } from 'next';
import { ReactElement } from 'react';

import AppLayout from './app';
import ModelLayout from './models';

/**
 * NextPage enhanced with an optional "layout" property.
 */
export type PageWithLayout<P = Record<string, unknown>> = NextPage<P> & {
  layout?: typeof AppLayout | typeof ModelLayout;
  withLayout?: (page: ReactElement) => ReactElement;
};

export { AppLayout, ModelLayout };

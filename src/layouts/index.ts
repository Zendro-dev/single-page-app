import { NextPage } from 'next';
import ModelsLayout from './models';

/**
 * NextPage enhanced with an optional "layout" property.
 */
export type PageWithLayout<P = Record<string, unknown>> = NextPage<P> & {
  layout?: typeof ModelsLayout;
};

export { ModelsLayout };

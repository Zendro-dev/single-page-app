import { NextPage } from 'next';
import ModelsLayout from './models';

/**
 * NextPage enhanced with an optional "layout" property.
 */
export type PageWithLayout<P = Record<string, unknown>> = NextPage<P> & {
  layout?: typeof ModelsLayout;
};

/**
 * App entry point (_app.tsx) enhanced with a "Component" that supports layouts
 */
export type AppWithLayouts<T> = { Component: PageWithLayout } & T;

export { ModelsLayout };

// Next's per-page `Component.layout = X` convention (PageWithLayout) is
// gone - react-router's nested routes (see App.tsx) wrap pages in the
// right layout directly, so there's no per-page layout property to declare
// anymore. Just re-exporting the two layouts themselves.
import AppLayout from './app';
import ModelLayout from './models';

export { AppLayout, ModelLayout };

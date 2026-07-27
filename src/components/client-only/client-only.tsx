import React from 'react';

// A no-op subscription: this store's snapshot never changes after mount, so
// there's nothing to notify useSyncExternalStore about.
function subscribe(): () => void {
  return () => {};
}

export default function ClientOnly<T>({
  children,
}: React.PropsWithChildren<T>): React.ReactElement | null {
  // useSyncExternalStore's client/server snapshot mismatch is exactly the
  // "did we hydrate yet" signal this component needs, without the extra
  // post-mount render a setState-in-effect would cause.
  const hasMounted = React.useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  if (!hasMounted) return null;
  return <>{children}</>;
}

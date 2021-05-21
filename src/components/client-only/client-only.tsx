import React from 'react';

export default function ClientOnly<T>({
  children,
}: React.PropsWithChildren<T>): React.ReactElement | null {
  const [hasMounted, setHasMounted] = React.useState(false);

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;
  return <>{children}</>;
}

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useCountdown from './useCountdown';

interface RedirectOptions {
  redirectTo?: string;
  redirectTimeout?: number;
}

interface RedirectReturn {
  redirect: (to: string) => void;
  redirectTimer: number;
}

export default function useRedirect(options: RedirectOptions): RedirectReturn {
  const router = useRouter();
  const [redirectTo, setRedirectTo] = useState<string>();
  const { timer, startTimer } = useCountdown(options.redirectTimeout);

  useEffect(
    function redirectUser() {
      if (timer === 0 && redirectTo) {
        console.log(`redirecting to ${redirectTo}`);
        router.push(redirectTo);
      }
    },
    [redirectTo, router, timer]
  );

  const redirect = (to: string): void => {
    setRedirectTo(to);
    startTimer();
  };

  return {
    redirect,
    redirectTimer: timer,
  };
}

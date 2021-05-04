import React, { ReactElement } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import useAuth from '@/hooks/useAuth';
import { Button, ButtonProps } from '@material-ui/core';

export default function LogoutButton(props: ButtonProps): ReactElement {
  const { logout } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();

  const handleLogoutButtonClick: React.MouseEventHandler<HTMLButtonElement> = () => {
    router.push('/');
    logout();
  };

  return (
    <Button onClick={handleLogoutButtonClick} {...props}>
      {t('toolBar.logout')}
    </Button>
  );
}

import React, { ReactElement } from 'react';
import useAuth from '../../hooks/useAuth';
import { Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

export default function LogoutButton(): ReactElement {
  const { logout } = useAuth();
  const { t } = useTranslation();

  const handleLogoutButtonClick: React.MouseEventHandler<HTMLButtonElement> = () => {
    logout();
  };

  return (
    <Button color="inherit" onClick={handleLogoutButtonClick}>
      {t('toolBar.logout')}
    </Button>
  );
}

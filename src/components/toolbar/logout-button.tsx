import React, { ReactElement } from 'react';
import useAuth from '../../hooks/useAuth';
import { Button } from '@material-ui/core';

export default function LogoutButton(): ReactElement {
  const { logout } = useAuth();

  const handleLogoutButtonClick: React.MouseEventHandler<HTMLButtonElement> = () => {
    logout();
  };

  return (
    <Button color="inherit" onClick={handleLogoutButtonClick}>
      Logout
    </Button>
  );
}

import { ThemeProvider } from '@mui/styles';
import { CssBaseline } from '@mui/material';

import { theme } from '@/styles/theme';
import { AuthProvider } from '@/auth/AuthProvider';
import AppLayout from '@/layouts/AppLayout';
import Home from '@/pages/Home';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppLayout>
          <Home />
        </AppLayout>
      </AuthProvider>
    </ThemeProvider>
  );
}

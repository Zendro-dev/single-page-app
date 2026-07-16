// Ported from pages/_app.tsx - same provider tree (theme, snackbar, dialog),
// minus next-auth's SessionProvider (see src/auth/AuthProvider.tsx) and
// minus the Component.layout convention: react-router's route tree below
// wraps each page in the right layout directly, the way _app.tsx used to
// via `Component.layout`.
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider } from '@mui/styles';
import { CssBaseline } from '@mui/material';

import { DialogProvider } from '@/components/dialog-popup';
import { theme } from '@/styles/theme';
import '@/i18n';

import { AuthProvider } from '@/auth/AuthProvider';
import { AppLayout, ModelLayout } from '@/layouts';

import Home from '@/pages/Home';
import GroupHome from '@/pages/GroupHome';
import ModelTable from '@/pages/ModelTable';
import RecordForm from '@/pages/RecordForm';
import AssociationTable from '@/pages/AssociationTable';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <DialogProvider>
          <AuthProvider>
            <BrowserRouter>
              <Routes>
                <Route
                  path="/"
                  element={
                    <AppLayout brand="Zendro">
                      <Home />
                    </AppLayout>
                  }
                />
                <Route
                  path="/:group"
                  element={
                    <ModelLayout brand="Zendro">
                      <GroupHome />
                    </ModelLayout>
                  }
                />
                <Route
                  path="/:group/:model"
                  element={
                    <ModelLayout brand="Zendro">
                      <ModelTable />
                    </ModelLayout>
                  }
                />
                <Route
                  path="/:group/:model/:request"
                  element={
                    <ModelLayout brand="Zendro">
                      <RecordForm />
                    </ModelLayout>
                  }
                />
                <Route
                  path="/:group/:model/:request/:association"
                  element={
                    <ModelLayout brand="Zendro">
                      <AssociationTable />
                    </ModelLayout>
                  }
                />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </DialogProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

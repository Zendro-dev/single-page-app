import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import {
  unstable_createMuiStrictModeTheme as createMuiTheme,
  ThemeProvider,
} from '@material-ui/core';

const theme = createMuiTheme({
  spacing: (factor) => `${0.25 * factor}rem`,
});

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <AppRoutes />
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;

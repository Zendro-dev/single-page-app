import { ReactElement } from 'react';
import { Alert, AlertTitle, ListItemText } from '@mui/material';

interface FormErrorsProps {
  ajvValidation?: string[] | null | undefined;
  clientValidation?: string | null | undefined;
}

export default function AttributeErrors({
  ajvValidation,
  clientValidation,
}: FormErrorsProps): ReactElement {
  return (
    <>
      {ajvValidation && (
        <Alert severity="error">
          <AlertTitle> Server side validation </AlertTitle>
          {ajvValidation.map((error) => {
            return <ListItemText key={error} primary={error} />;
          })}
        </Alert>
      )}
      {clientValidation && (
        <Alert severity="warning">
          <AlertTitle> Client side validation </AlertTitle>
          <ListItemText primary={clientValidation} />
        </Alert>
      )}
    </>
  );
}

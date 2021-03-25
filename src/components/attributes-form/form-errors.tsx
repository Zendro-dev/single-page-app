import { Alert, AlertTitle, ListItemText } from '@material-ui/core';
import { ReactElement } from 'react';

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

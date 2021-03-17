import { Alert, AlertTitle, ListItemText } from '@material-ui/core';
import { ReactElement } from 'react';

export interface ErrorsAttribute {
  ajvValidation?: string[] | null | undefined;
  clientValidation?: string | null | undefined;
}

interface ErrorProps {
  errors: ErrorsAttribute;
}

export default function AttributeErrors({ errors }: ErrorProps): ReactElement {
  return (
    <div>
      {errors.ajvValidation && (
        <Alert severity="error">
          <AlertTitle> Server side validation </AlertTitle>
          {errors.ajvValidation.map((error) => {
            return <ListItemText key={error} primary={error} />;
          })}
        </Alert>
      )}
      {errors.clientValidation && (
        <Alert severity="warning">
          <AlertTitle> Client side validation </AlertTitle>
          <ListItemText primary={errors.clientValidation} />
        </Alert>
      )}
    </div>
  );
}

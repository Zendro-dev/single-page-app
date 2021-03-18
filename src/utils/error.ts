import { ErrorsAttribute } from '@/components/alert/attributes-error';
import { AxiosError, AxiosResponse } from 'axios';
import { GraphQLFormattedError } from 'graphql';

interface ValidationError {
  dataPath: string;
  message: string;
}

function getValidationErrors(
  errors: GraphQLFormattedError
): Record<string, string[]> {
  const result: Record<string, string[]> = {};

  const errors_detail: ValidationError[] = errors.extensions?.validationErrors;
  errors_detail.forEach(({ dataPath, message }) => {
    const attribute = dataPath.slice(1);
    result[attribute]
      ? result[attribute].push(message)
      : (result[attribute] = [message]);
  });

  return result;
}

function castToErrorsAttribute(
  validationErrors: Record<string, string[]>
): Record<string, ErrorsAttribute> {
  const result: Record<string, ErrorsAttribute> = {};

  for (const [key, errors] of Object.entries(validationErrors)) {
    //unique error and as ajvValidation
    result[key] = { ajvValidation: Array.from(new Set(errors)) };
  }

  return result;
}

export function parseErrors(
  error: AxiosError
): {
  generalErrors: (GraphQLFormattedError | AxiosResponse)[];
  attributeErrors: Record<string, ErrorsAttribute>;
} {
  let generalErrors: (GraphQLFormattedError | AxiosResponse)[] = [];
  let validationErrors: Record<string, string[]> = {};

  if (error.isAxiosError && error.response) {
    //at this point is a graphql response error (data, errors)
    const errors = error.response.data.errors as GraphQLFormattedError[];
    const validation_error = errors.find(
      (e) => e.message === 'validation failed'
    );

    validationErrors = validation_error
      ? getValidationErrors(validation_error)
      : {};
    generalErrors = errors.filter((e) => e.message !== 'validation failed');
  } else {
    error.response
      ? generalErrors.push(error.response)
      : generalErrors.push(error);
  }

  //send as ErrorsAttribute
  const attributeErrors = castToErrorsAttribute(validationErrors);

  return { generalErrors, attributeErrors };
}

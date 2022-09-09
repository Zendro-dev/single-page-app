import {
  ExtendedClientError,
  GraphQLError,
  ParsedGraphQLErrors,
  ParsedErrorResponse,
} from '@/types/errors';

export function parseErrorResponse<T>(
  error: Error | ExtendedClientError<T>
): ParsedErrorResponse {
  const rawError = error as ExtendedClientError<T>;

  if (!rawError.response)
    return {
      status: 500,
      networkError: (error as Error).message,
    };

  const genericError = rawError.response.error ?? undefined;
  const graphqlErrors = rawError.response.errors
    ? parseGraphqlErrors(rawError.response.errors)
    : undefined;

  return {
    status: rawError.response.status,
    genericError,
    graphqlErrors,
  };
}

/**
 * Parse and extract validation errors from a graphql errors response.
 * @param errors graphql errors with optional ajv errors extension
 * @returns map of attribute name to ajv error messages
 */
export function parseGraphqlErrors(
  errors: GraphQLError[]
): ParsedGraphQLErrors {
  const parsedErrors: ParsedGraphQLErrors = {
    tokenInvalidErrors: [],
    nonValidationErrors: [],
    validationErrors: {},
  };

  return errors.reduce((acc, error) => {
    // If no extensions, store the full GraphQLError (unknown error)
    if (!error.extensions?.validationErrors) {
      if (
        error.message === 'TokenExpiredError: jwt expired' ||
        error.message === "You don't have authorization to perform this action"
      ) {
        acc.tokenInvalidErrors.push(error);
      } else {
        acc.nonValidationErrors.push(error);
      }
      return acc;
    }

    // Parse validation errors
    error.extensions.validationErrors.forEach(
      ({ instancePath, keyword, message }) => {
        const attributeName = instancePath.slice(1);
        const errors = new Set(acc.validationErrors[attributeName]);
        errors.add(message ?? keyword);
        acc.validationErrors[attributeName] = Array.from(errors);
      }
    );

    return acc;
  }, parsedErrors);
}

export function hasTokenExpiredErrors(errors: GraphQLError[]): boolean {
  const foundTokenExpiredError = errors.find(
    ({ message }) => message === 'TokenExpiredError: jwt expired'
  );

  return foundTokenExpiredError !== undefined;
}

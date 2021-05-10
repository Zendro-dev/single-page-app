import { GraphQLError, ParsedGraphQLErrors } from '@/types/errors';

/**
 * Parse and extract validation errors from a graphql errors response.
 * @param errors graphql errors with optional ajv errors extension
 * @returns map of attribute name to ajv error messages
 */
export function parseGraphqlErrors(
  errors: GraphQLError[]
): ParsedGraphQLErrors {
  const parsedErrors: ParsedGraphQLErrors = {
    tokenExpiredErrors: [],
    nonValidationErrors: [],
    validationErrors: {},
  };

  return errors.reduce((acc, error) => {
    // If no extensions, store the full GraphQLError (unknown error)
    if (!error.extensions?.validationErrors) {
      if (error.message === 'TokenExpiredError: jwt expired') {
        acc.tokenExpiredErrors.push(error);
      } else {
        acc.nonValidationErrors.push(error);
      }
      return acc;
    }

    // Parse validation errors
    error.extensions.validationErrors.forEach(
      ({ dataPath, keyword, message }) => {
        const attributeName = dataPath.slice(1);
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

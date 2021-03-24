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
    extensionsErrors: {},
    nonExtensionsErrors: [],
    validationErrors: {},
  };

  return errors.reduce((acc, error) => {
    // If no extensions, store the full GraphQLError (unknown error)
    if (!error.extensions) {
      acc.nonExtensionsErrors.push(error);
      return acc;
    }

    // Parse validation errors
    error.extensions.validationErrors?.forEach(
      ({ dataPath, keyword, message }) => {
        const attributeName = dataPath.slice(1);
        const errors = new Set(acc.validationErrors[attributeName]);
        errors.add(message ?? keyword);
        acc.validationErrors[attributeName] = Array.from(errors);
      }
    );

    // TODO: parse extensionErrors that are not validation (ddm?)

    return acc;
  }, parsedErrors);
}

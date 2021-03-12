type ValidationError = {
  dataPath: string;
  message: string;
};

export function parseValidationErrors(errors: any): Record<string, string[]> {
  const result: Record<string, string[]> = {};

  errors.forEach((error: any) => {
    if (error.response && error.response.data && error.response.data.errors) {
      const errors = error.response.data.errors;
      const validation_error = errors.find(
        (e: any) => e.message === 'validation failed'
      );
      if (validation_error) {
        const errors_detail: ValidationError[] =
          validation_error.extensions.validationErrors;
        errors_detail.forEach(({ dataPath, message }) => {
          const attribute = dataPath.slice(1);
          result[attribute]
            ? result[attribute].push(message)
            : (result[attribute] = [message]);
        });
      }
    }
  });

  return result;
}

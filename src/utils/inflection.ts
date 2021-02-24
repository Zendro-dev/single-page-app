import { pluralize } from 'inflection';

export interface Inflection {
  name: string;
  nameCp: string;
  nameLc: string;
  namePlLc: string;
  namePlCp: string;
}

export function getInflections(modelName: string): Inflection {
  const inflection: Inflection = {
    name: modelName,
    nameCp: capitalizeString(modelName),
    nameLc: uncapitalizeString(modelName),
    namePlLc: pluralize(uncapitalizeString(modelName)),
    namePlCp: pluralize(capitalizeString(modelName)),
  };

  return inflection;
}

/**
 * uncapitalizeString - set initial character to lower case
 *
 * @param  {string} word String input to uncapitalize
 * @return {string}      String with lower case in the initial character
 */
function uncapitalizeString(word: string): string {
  const length = word.length;
  if (length == 1) {
    return word.toLowerCase();
  } else {
    return word.slice(0, 1).toLowerCase() + word.slice(1, length);
  }
}

/**
 * capitalizeString - set initial character to upper case
 *
 * @param  {type} word String input to capitalize
 * @return {type}      String with upper case in the initial character
 */
function capitalizeString(word: string): string {
  const length = word.length;
  if (length == 1) {
    return word.toUpperCase();
  } else {
    return word.slice(0, 1).toUpperCase() + word.slice(1, length);
  }
}

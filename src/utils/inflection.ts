import { pluralize } from 'inflection';

export interface Inflection {
  name: string;
  nameCp: string;
  nameLc: string;
  namePlLc: string;
  namePlCp: string;
}

/**
 * Get plural and capitalized versions of a given string.
 * @param name string to get inflections for
 */
export function getInflections(name: string): Inflection {
  const inflection: Inflection = {
    name,
    nameCp: capitalizeString(name),
    nameLc: uncapitalizeString(name),
    namePlLc: pluralize(uncapitalizeString(name)),
    namePlCp: pluralize(capitalizeString(name)),
  };

  return inflection;
}

/**
 * Set initial character of a word to lowercase.
 * @param word word to uncapitalize
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
 * Set the initial character of a word to uppercase.
 * @param word word to capitalize
 */
function capitalizeString(word: string): string {
  const length = word.length;
  if (length == 1) {
    return word.toUpperCase();
  } else {
    return word.slice(0, 1).toUpperCase() + word.slice(1, length);
  }
}

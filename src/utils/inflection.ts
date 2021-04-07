import { pluralize, capitalize } from 'inflection';

export interface Inflection {
  name: string;
  /** Capitalized */
  nameCp: string;
  /** Lowercase */
  nameLc: string;
  /** Plural-Lowercase */
  namePlLc: string;
  /** Plural-Capitalized */
  namePlCp: string;
}

/**
 * Get plural and capitalized versions of a given string.
 * @param name string to get inflections for
 */
export function getInflections(name: string): Inflection {
  const inflection: Inflection = {
    name,
    nameCp: capitalize(name),
    nameLc: uncapitalizeString(name),
    namePlLc: pluralize(uncapitalizeString(name)),
    namePlCp: pluralize(capitalize(name)),
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

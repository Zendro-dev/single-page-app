import chalk from 'chalk';

/**
 * Print a formatted message to stdout.
 * @param message message to print to stdout
 * @returns the formatted message
 */
export function log(message: string): string {
  const zendr = chalk.yellow('zendr') + ' - ';
  return zendr + message;
}

import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind CSS classes with other class names.
 *
 * @param {...(string | undefined | null | false)} inputs - Class names to merge.
 * @returns {string} - Merged class names.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

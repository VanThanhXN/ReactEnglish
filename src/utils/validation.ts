/**
 * Utility functions cho validation
 */

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate name (ít nhất 2 ký tự)
 */
export const isValidName = (name: string): boolean => {
  return name.trim().length >= 2;
};

/**
 * Validate password (ít nhất 8 ký tự)
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 8;
};

/**
 * Check if passwords match
 */
export const doPasswordsMatch = (
  password: string,
  passwordConfirm: string
): boolean => {
  return password === passwordConfirm && password.length > 0;
};






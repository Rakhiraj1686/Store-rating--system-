export function validateName(name) {
  const value = name.trim();
  if (!value) return 'Name is required';
  if (value.length < 2 || value.length > 60) {
    return 'Name must be between 2 and 60 characters';
  }
  return '';
}

export function validateEmail(email) {
  if (!email.trim()) return 'Email is required';
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ? ''
    : 'Please enter a valid email address';
}

export function validateAddress(address) {
  if (!address.trim()) return 'Address is required';
  return address.trim().length <= 400 ? '' : 'Address cannot exceed 400 characters';
}

export function validatePassword(password) {
  if (!password) return 'Password is required';
  return /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/.test(password)
    ? ''
    : 'Password must be 8-16 characters with one uppercase letter and one special character';
}

export function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) return 'Please confirm your password';
  return password === confirmPassword ? '' : 'Passwords do not match';
}

export function hasNoErrors(errors) {
  return Object.values(errors).every((error) => !error);
}

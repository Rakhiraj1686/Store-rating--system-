import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerRequest } from '../services/authService.js';
import { getErrorMessage } from '../services/api.js';
import {
  validateName,
  validateEmail,
  validateAddress,
  validatePassword,
  validateConfirmPassword,
  hasNoErrors,
} from '../utils/validation.js';

const emptyForm = { name: '', email: '', address: '', password: '', confirmPassword: '' };

const inputClass = (error) =>
  `w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 ${
    error ? 'border-red-500' : 'border-gray-400 focus:border-blue-600'
  }`;

function Field({ label, name, error, children }) {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="mb-1 block text-sm font-medium text-gray-800">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Clear the message of the field being edited
    setErrors({ ...errors, [name]: '' });
  };

  const validate = () => ({
    name: validateName(form.name),
    email: validateEmail(form.email),
    address: validateAddress(form.address),
    password: validatePassword(form.password),
    confirmPassword: validateConfirmPassword(form.password, form.confirmPassword),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    const newErrors = validate();
    setErrors(newErrors);
    if (!hasNoErrors(newErrors)) return;

    setSubmitting(true);
    try {
      await registerRequest({
        name: form.name.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
      });
      navigate('/login', {
        state: { message: 'Account created. You can login now.' },
      });
    } catch (err) {
      // Field errors from the backend (e.g. email already registered)
      const fieldErrors = err.response?.data?.errors;
      if (fieldErrors) {
        setErrors(fieldErrors);
      } else {
        setServerError(getErrorMessage(err));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-6">
      <div className="w-full max-w-md rounded-md border border-gray-300 bg-white p-6">
        <h1 className="mb-1 text-center text-xl font-semibold text-gray-900">
          Store Rating System
        </h1>
        <h2 className="mb-4 text-center text-lg font-medium text-gray-600">Create Account</h2>

        {serverError && (
          <p className="mb-4 rounded border border-red-200 bg-red-100 px-3 py-2 text-sm text-red-800">
            {serverError}
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <Field label="Name" name="name" error={errors.name}>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              autoComplete="name"
              className={inputClass(errors.name)}
            />
          </Field>

          <Field label="Email" name="email" error={errors.email}>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              className={inputClass(errors.email)}
            />
          </Field>

          <Field label="Address" name="address" error={errors.address}>
            <textarea
              id="address"
              name="address"
              rows={3}
              value={form.address}
              onChange={handleChange}
              className={`${inputClass(errors.address)} resize-y`}
            />
          </Field>

          <Field label="Password" name="password" error={errors.password}>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              className={inputClass(errors.password)}
            />
          </Field>
          <p className="-mt-2 mb-4 text-xs text-gray-500">
            8-16 characters, with at least one uppercase letter and one special character.
          </p>

          <Field label="Confirm Password" name="confirmPassword" error={errors.confirmPassword}>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              className={inputClass(errors.confirmPassword)}
            />
          </Field>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-700">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
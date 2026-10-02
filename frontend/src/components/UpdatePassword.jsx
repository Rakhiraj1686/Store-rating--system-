import { useState } from 'react';
import { updatePasswordRequest } from '../services/authService.js';
import { getErrorMessage } from '../services/api.js';
import { validatePassword } from '../utils/validation.js';

const inputClass =
  'w-full rounded border border-gray-400 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200';

function UpdatePassword() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!form.currentPassword) {
      setError('Current password is required');
      return;
    }
    const passwordError = validatePassword(form.newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setSubmitting(true);
    try {
      await updatePasswordRequest(form.currentPassword, form.newPassword);
      setMessage('Password updated successfully');
      setForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 max-w-sm border-t border-gray-200 pt-4">
      <h2 className="mb-3 font-medium text-gray-900">Update Password</h2>

      {message && (
        <p className="mb-3 rounded border border-green-200 bg-green-100 px-3 py-2 text-sm text-green-800">
          {message}
        </p>
      )}
      {error && (
        <p className="mb-3 rounded border border-red-200 bg-red-100 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      )}

      <div className="mb-3">
        <label htmlFor="currentPassword" className="mb-1 block text-sm font-medium text-gray-800">
          Current Password
        </label>
        <input
          id="currentPassword"
          name="currentPassword"
          type="password"
          value={form.currentPassword}
          onChange={handleChange}
          autoComplete="current-password"
          className={inputClass}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="newPassword" className="mb-1 block text-sm font-medium text-gray-800">
          New Password
        </label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          value={form.newPassword}
          onChange={handleChange}
          autoComplete="new-password"
          className={inputClass}
        />
        <p className="mt-1 text-xs text-gray-500">
          8-16 characters, with at least one uppercase letter and one special character.
        </p>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? 'Updating...' : 'Update Password'}
      </button>
    </form>
  );
}

export default UpdatePassword;

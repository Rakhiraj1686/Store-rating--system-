import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { dashboardPaths, loginRequest, saveLogin } from '../services/authService.js';
import { getErrorMessage } from '../services/api.js';

const inputClass =
  'w-full rounded border border-gray-400 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: '', password: '', role: 'user' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.email.trim() || !form.password) {
      setError('All required fields must be filled');
      return;
    }

    setSubmitting(true);
    try {
      const res = await loginRequest({
        email: form.email.trim(),
        password: form.password,
        role: form.role,
      });
      const { token, user } = res.data;
      saveLogin(token, user);
      navigate(dashboardPaths[user.role], { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
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
        <h2 className="mb-4 text-center text-lg font-medium text-gray-600">Login</h2>

        {location.state?.message && !error && (
          <p className="mb-4 rounded border border-green-200 bg-green-100 px-3 py-2 text-sm text-green-800">
            {location.state.message}
          </p>
        )}

        {error && (
          <p className="mb-4 rounded border border-red-200 bg-red-100 px-3 py-2 text-sm text-red-800">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-800">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              className={inputClass}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-800">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              className={inputClass}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="role" className="mb-1 block text-sm font-medium text-gray-800">
              Login as
            </label>
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="user">Normal User</option>
              <option value="store_owner">Store Owner</option>
              <option value="admin">System Administrator</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-700">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;

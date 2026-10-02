import { useNavigate } from 'react-router-dom';
import { getUser, logout } from '../services/authService.js';

function Dashboard({ title }) {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-2xl rounded-md border border-gray-300 bg-white p-6">
        <h1 className="mb-2 text-xl font-semibold text-gray-900">{title}</h1>
        <p className="mb-1 text-gray-700">Welcome to {title}</p>
        <p className="mb-4 text-sm text-gray-500">Logged in as {user?.name}</p>
        <button
          onClick={handleLogout}
          className="rounded bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;

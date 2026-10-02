import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, logout } from '../services/authService.js';
import { getErrorMessage } from '../services/api.js';
import { getOwnerStore } from '../services/storeService.js';
import UpdatePassword from './UpdatePassword.jsx';

function StoreOwnerDashboard() {
  const navigate = useNavigate();
  const user = getUser();

  const [store, setStore] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [sort, setSort] = useState({ sortBy: 'userName', order: 'asc' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadStore = async (sortValue) => {
    try {
      const res = await getOwnerStore(sortValue);
      setStore(res.data.store);
      setRatings(res.data.ratings);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  useEffect(() => {
    getOwnerStore({ sortBy: 'userName', order: 'asc' })
      .then((res) => {
        setStore(res.data.store);
        setRatings(res.data.ratings);
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const handleSort = (column) => {
    const order = sort.sortBy === column && sort.order === 'asc' ? 'desc' : 'asc';
    const newSort = { sortBy: column, order };
    setSort(newSort);
    loadStore(newSort);
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="mx-auto max-w-4xl rounded-md border border-gray-300 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Store Owner Dashboard</h1>
            <p className="text-sm text-gray-500">Logged in as {user?.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Logout
          </button>
        </div>

        {error && (
          <p className="mb-4 rounded border border-red-200 bg-red-100 px-3 py-2 text-sm text-red-800">
            {error}
          </p>
        )}

        {!loading && !error && !store && (
          <p className="rounded border border-gray-300 bg-gray-50 px-3 py-3 text-sm text-gray-700">
            No store is linked to your account yet.
          </p>
        )}

        {store && (
          <>
            <div className="mb-4 rounded border border-gray-300 bg-gray-50 p-4 text-sm text-gray-800">
              <h2 className="mb-1 text-lg font-medium text-gray-900">{store.name}</h2>
              <p>{store.address}</p>
              <p className="mt-2">
                Average Rating:{' '}
                <span className="font-semibold">{store.averageRating ?? 'Not Rated'}</span>
                {store.totalRatings > 0 && ` (${store.totalRatings} ratings)`}
              </p>
            </div>

            <h2 className="mb-2 font-medium text-gray-900">Users who rated your store</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-300 bg-gray-100 text-gray-800">
                    {[
                      ['userName', 'Name'],
                      ['userEmail', 'Email'],
                      ['rating', 'Rating'],
                      ['updatedAt', 'Date'],
                    ].map(([column, label]) => (
                      <th
                        key={column}
                        onClick={() => handleSort(column)}
                        className="cursor-pointer select-none px-3 py-2 hover:bg-gray-200"
                      >
                        {label}
                        {sort.sortBy === column && (sort.order === 'asc' ? ' ▲' : ' ▼')}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ratings.map((item) => (
                    <tr key={item.id} className="border-b border-gray-200">
                      <td className="px-3 py-2">{item.userName}</td>
                      <td className="px-3 py-2">{item.userEmail}</td>
                      <td className="px-3 py-2">{item.rating}</td>
                      <td className="px-3 py-2">
                        {new Date(item.updatedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {ratings.length === 0 && (
                <p className="py-4 text-center text-sm text-gray-500">
                  No one has rated your store yet
                </p>
              )}
            </div>
          </>
        )}

        <UpdatePassword />
      </div>
    </div>
  );
}

export default StoreOwnerDashboard;

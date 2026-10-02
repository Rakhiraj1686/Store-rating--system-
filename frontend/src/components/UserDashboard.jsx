import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, logout } from '../services/authService.js';
import { getErrorMessage } from '../services/api.js';
import { addRating, getStores, updateRating } from '../services/storeService.js';

function UserDashboard() {
  const navigate = useNavigate();
  const user = getUser();

  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedStore, setSelectedStore] = useState(null);
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadStores = async (searchText = '') => {
    try {
      const res = await getStores(searchText);
      setStores(res.data.stores);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  useEffect(() => {
    getStores('')
      .then((res) => setStores(res.data.stores))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    loadStores(search.trim());
  };

  const openRating = (store) => {
    setSelectedStore(store);
    setRating(store.userRating || 5);
    setError('');
    setMessage('');
  };

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (selectedStore.userRating) {
        await updateRating(selectedStore.ratingId, rating);
        setMessage('Rating updated');
      } else {
        await addRating(selectedStore.id, rating);
        setMessage('Rating submitted');
      }
      setSelectedStore(null);
      loadStores(search.trim());
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="mx-auto max-w-4xl rounded-md border border-gray-300 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">User Dashboard</h1>
            <p className="text-sm text-gray-500">Logged in as {user?.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Logout
          </button>
        </div>

        <form onSubmit={handleSearch} className="mb-4 flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by store name or address"
            className="w-full rounded border border-gray-400 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <button
            type="submit"
            className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Search
          </button>
        </form>

        {message && (
          <p className="mb-4 rounded border border-green-200 bg-green-100 px-3 py-2 text-sm text-green-800">
            {message}
          </p>
        )}
        {error && (
          <p className="mb-4 rounded border border-red-200 bg-red-100 px-3 py-2 text-sm text-red-800">
            {error}
          </p>
        )}

        {selectedStore && (
          <form
            onSubmit={handleSubmitRating}
            className="mb-4 rounded border border-gray-300 bg-gray-50 p-4"
          >
            <h2 className="mb-1 font-medium text-gray-900">
              {selectedStore.userRating ? 'Update your rating' : `Rate ${selectedStore.name}`}
            </h2>
            {selectedStore.userRating && (
              <p className="mb-2 text-sm text-gray-600">
                {selectedStore.name} - current rating: {selectedStore.userRating}
              </p>
            )}
            <div className="mb-3 flex gap-4">
              {[1, 2, 3, 4, 5].map((value) => (
                <label key={value} className="flex items-center gap-1 text-sm text-gray-800">
                  <input
                    type="radio"
                    name="rating"
                    value={value}
                    checked={rating === value}
                    onChange={() => setRating(value)}
                  />
                  {value}
                </label>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                {selectedStore.userRating ? 'Update Rating' : 'Submit Rating'}
              </button>
              <button
                type="button"
                onClick={() => setSelectedStore(null)}
                className="rounded border border-gray-400 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-gray-300 bg-gray-100 text-gray-800">
                <th className="px-3 py-2">Store Name</th>
                <th className="px-3 py-2">Address</th>
                <th className="px-3 py-2">Overall Rating</th>
                <th className="px-3 py-2">My Rating</th>
                <th className="px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {stores.map((store) => (
                <tr key={store.id} className="border-b border-gray-200">
                  <td className="px-3 py-2">{store.name}</td>
                  <td className="px-3 py-2">{store.address}</td>
                  <td className="px-3 py-2">{store.overallRating ?? 'Not Rated'}</td>
                  <td className="px-3 py-2">{store.userRating ?? 'Not Rated'}</td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() => openRating(store)}
                      className="rounded border border-blue-600 px-3 py-1 text-blue-600 hover:bg-blue-50"
                    >
                      {store.userRating ? 'Modify Rating' : 'Rate Store'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && stores.length === 0 && (
            <p className="py-4 text-center text-sm text-gray-500">No stores found</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;

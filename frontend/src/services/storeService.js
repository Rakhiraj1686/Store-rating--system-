import api from './api.js';

export function getStores(search) {
  return api.get('/stores', { params: { search } });
}

export function addRating(storeId, rating) {
  return api.post('/ratings', { storeId, rating });
}

export function updateRating(ratingId, rating) {
  return api.put(`/ratings/${ratingId}`, { rating });
}

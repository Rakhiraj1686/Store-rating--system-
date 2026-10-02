import api from './api.js';

export function getStores(params) {
  return api.get('/stores', { params });
}

export function addRating(storeId, rating) {
  return api.post('/ratings', { storeId, rating });
}

export function updateRating(ratingId, rating) {
  return api.put(`/ratings/${ratingId}`, { rating });
}

export function getOwnerStore(params) {
  return api.get('/owner/store', { params });
}

import api from './api.js';

export function registerRequest(user) {
  return api.post('/auth/register', user);
}

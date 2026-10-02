import api from './api.js';

export const dashboardPaths = {
  admin: '/admin',
  user: '/user',
  store_owner: '/store-owner',
};

export function registerRequest(user) {
  return api.post('/auth/signup', user);
}

export function loginRequest(data) {
  return api.post('/auth/login', data);
}

export function saveLogin(token, user) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch {
    return null;
  }
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

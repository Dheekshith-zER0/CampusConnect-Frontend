import api from './client.js'

const data = (response) => response.data

export const authApi = {
  register: (payload) => api.post('/auth/register', payload).then(data),
  login: (payload) => api.post('/auth/login', payload).then(data),
  me: () => api.get('/auth/me').then(data),
  logout: () => api.post('/auth/logout'),
}

export const complaintApi = {
  create: (payload) => api.post('/complaints', payload).then(data),
  getMine: () => api.get('/complaints/my').then(data),
  // Returns { complaint, history }
  getById: (id) => api.get(`/complaints/${id}`).then(data),
  update: (id, payload) => api.put(`/complaints/${id}`, payload).then(data),
  remove: (id) => api.delete(`/complaints/${id}`),
}

export const adminApi = {
  // filters: { status, category, search } - empty values are left out of the query string
  getComplaints: (filters = {}) => {
    const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value))
    return api.get('/admin/complaints', { params }).then(data)
  },
  updateStatus: (id, payload) => api.patch(`/admin/complaints/${id}/status`, payload).then(data),
  getStats: () => api.get('/admin/stats').then(data),
}

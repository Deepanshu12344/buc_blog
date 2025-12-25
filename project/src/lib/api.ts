const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const getAuthToken = () => localStorage.getItem('token');

export const apiClient = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const token = getAuthToken();
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Request failed');
  }

  return response.json();
};

// Blog API functions
export const blogApi = {
  create: (title: string, content: string) =>
    apiClient('/blog/new-story', {
      method: 'POST',
      body: JSON.stringify({ title, content }),
    }),

  edit: (id: string, title: string, content: string) =>
    apiClient(`/blog/new-story/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ title, content }),
    }),

  delete: (id: string) =>
    apiClient(`/blog/new-story/${id}`, {
      method: 'DELETE',
    }),

  getAll: () => apiClient('/blog/all'),

  getById: (id: string) => apiClient(`/blog/${id}`),
};
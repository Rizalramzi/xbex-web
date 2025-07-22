import axios from 'axios';

// Create an axios instance with a base URL and default headers
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000 // 10 seconds timeout
});

// Add a request interceptor for authentication
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for error handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    // Handle expired tokens, network errors, etc.
    if (error.response && error.response.status === 401) {
      // Handle unauthorized error (e.g., redirect to login)
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;

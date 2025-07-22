import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: {
      id: 1,
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin'
    }, // Auto-set user for development
    token: localStorage.getItem('token') || 'dev-token', // Auto-login for development
    loading: false,
    error: null
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user
  },
  
  actions: {
    async login(credentials) {
      this.loading = true;
      try {
        // Replace with actual API call when you have an authentication endpoint
        // const response = await authService.login(credentials);
        
        // Mock login for development
        const mockResponse = {
          data: {
            token: 'mock-jwt-token',
            user: {
              id: 1,
              name: 'Admin User',
              email: credentials.email,
              role: 'admin'
            }
          }
        };
        
        const { token, user } = mockResponse.data;
        
        // Store token in localStorage for persistence
        localStorage.setItem('token', token);
        
        // Update store state
        this.token = token;
        this.user = user;
        this.error = null;
        
        return true;
      } catch (error) {
        this.error = error.message || 'Login failed';
        console.error('Login error:', error);
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    async logout() {
      // Clear token from localStorage
      localStorage.removeItem('token');
      
      // Reset store state
      this.token = null;
      this.user = null;
      
      return true;
    },
    
    async fetchUserProfile() {
      if (!this.token) return null;
      
      this.loading = true;
      try {
        // Replace with actual API call
        // const response = await authService.getUserProfile();
        
        // Mock user profile for development
        const mockUser = {
          id: 1,
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin'
        };
        
        this.user = mockUser;
        this.error = null;
        
        return mockUser;
      } catch (error) {
        this.error = error.message || 'Failed to fetch user profile';
        console.error('Error fetching user profile:', error);
        return null;
      } finally {
        this.loading = false;
      }
    }
  }
});

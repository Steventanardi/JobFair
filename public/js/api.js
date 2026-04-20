/**
 * API Helper — NQU Job Fair System
 * Centralized fetch wrapper with error handling
 */

const API = {
  /**
   * Make an API request
   * @param {string} endpoint - API endpoint (e.g., '/api/auth/login')
   * @param {object} options - Fetch options
   * @returns {Promise<object>} Response data
   */
  async request(endpoint, options = {}) {
    const config = {
      headers: {},
      credentials: 'include',
      ...options
    };

    // Don't set Content-Type for FormData (multer needs multipart boundary)
    if (!(config.body instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
      if (config.body && typeof config.body === 'object') {
        config.body = JSON.stringify(config.body);
      }
    }

    try {
      const response = await fetch(endpoint, config);
      
      // Get content type to check if it's JSON
      const contentType = response.headers.get('content-type');
      let data = null;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        // Not JSON — likely an error page (HTML) or empty response
        const text = await response.text();
        if (!response.ok) {
          throw new Error(`Server error (${response.status}): The server returned an unexpected response.`);
        }
        return text; 
      }

      if (!response.ok) {
        throw new Error(data.error || `Request failed (${response.status})`);
      }

      return data;
    } catch (error) {
      if (error.message === 'Failed to fetch') {
        throw new Error('Network error — please check your connection');
      }
      // If it's a JSON parse error (which shouldn't happen now but just in case)
      if (error instanceof SyntaxError) {
        throw new Error('The server returned an invalid data format.');
      }
      throw error;
    }
  },

  // Convenience methods
  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  },

  post(endpoint, body) {
    return this.request(endpoint, { method: 'POST', body });
  },

  put(endpoint, body) {
    return this.request(endpoint, { method: 'PUT', body });
  },

  patch(endpoint, body) {
    return this.request(endpoint, { method: 'PATCH', body });
  },

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  },

  /**
   * Upload with FormData
   */
  upload(endpoint, formData, method = 'POST') {
    return this.request(endpoint, {
      method,
      body: formData
    });
  },

  /**
   * Check current auth session
   */
  async checkAuth() {
    try {
      const data = await this.get('/api/auth/me');
      return data.user;
    } catch {
      return null;
    }
  }
};

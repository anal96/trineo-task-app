// API URL configuration
// In production, use deployed backend URL from env
// In development, default to local backend
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = `${API_BASE}/api`;

// Debug: Log API URL
if (import.meta.env.DEV) {
  console.log('🔗 API BASE:', API_BASE);
  console.log('🔗 API URL (for /api routes):', API_URL);
}

// Get auth token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// API request helper
const request = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const isAbsolute =
      endpoint.startsWith('http://') || endpoint.startsWith('https://');
    const url = isAbsolute ? endpoint : `${API_URL}${endpoint}`;
    console.log(`🌐 Making request to: ${url}`, options.method || 'GET');

    const response = await fetch(url, {
      ...options,
      headers,
    });

    console.log(`📡 Response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        error: `Server error: ${response.status} ${response.statusText}`
      }));
      console.error('❌ API Error:', error);
      throw new Error(error.error || `Request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ API Success:', endpoint);
    return data;
  } catch (error: any) {
    console.error('❌ Request failed:', error);

    // Handle network errors
    if (error.name === 'TypeError' && (error.message.includes('fetch') || error.message.includes('Failed to fetch'))) {
      throw new Error(
        `Cannot connect to server. ` +
        `Make sure both frontend (port 5173) and backend (port 5000) are running. ` +
        `Start backend with: npm run dev:server`
      );
    }
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: async (name: string, email: string, password: string) => {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },

  login: async (email: string, password: string) => {
    // Use base URL directly because backend login endpoint is /login (no /api prefix)
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });


    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user has a valid session
  verifySession: async () => {
    const token = getToken();
    if (!token) {
      return null;
    }

    try {
      // Verify token by fetching current user
      const user = await userAPI.getCurrent();
      return user;
    } catch (error) {
      // Token is invalid, clear it
      authAPI.logout();
      return null;
    }
  },
};

// Tasks API
export const tasksAPI = {
  getAll: async (status?: string, projectId?: string) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (projectId) params.append('projectId', projectId);
    const query = params.toString() ? `?${params.toString()}` : '';
    return request(`/tasks${query}`);
  },

  getById: async (id: string) => {
    return request(`/tasks/${id}`);
  },

  create: async (taskData: {
    title: string;
    description?: string;
    projectId: string;
    status?: string;
    priority?: string;
    estimatedTime?: number;
    dueDate?: string;
  }) => {
    return request('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  },

  update: async (id: string, taskData: Partial<typeof taskData>) => {
    return request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  },

  delete: async (id: string) => {
    return request(`/tasks/${id}`, {
      method: 'DELETE',
    });
  },

  getStats: async () => {
    return request('/tasks/stats/summary');
  },
};

// Projects API
export const projectsAPI = {
  getAll: async () => {
    return request('/projects');
  },

  getById: async (id: string) => {
    return request(`/projects/${id}`);
  },

  create: async (projectData: { name: string; type: string; color?: string }) => {
    return request('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  },

  update: async (id: string, projectData: Partial<typeof projectData>) => {
    return request(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });
  },

  delete: async (id: string) => {
    return request(`/projects/${id}`, {
      method: 'DELETE',
    });
  },
};

// User API
export const userAPI = {
  getCurrent: async () => {
    return request('/users/me');
  },

  update: async (userData: { name?: string; avatar?: string }) => {
    return request('/users/me', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },
};

// Team API
export const teamAPI = {
  getMembers: async () => {
    return request('/team/members');
  },

  getTeamStats: async (timeRange: 'week' | 'month' | 'all' = 'month') => {
    return request(`/team/stats?timeRange=${timeRange}`);
  },

  getMemberStats: async (memberId: string) => {
    return request(`/team/members/${memberId}/stats`);
  },
};


import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios'; // Assuming axios is used for API calls

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on initial load
    const token = localStorage.getItem('authToken');
    if (token) {
      // Optionally: Validate token with backend and fetch user data
      // For simplicity, we'll just assume the token is valid for now
      // In a real app, you'd fetch user data based on the token
      // Example: fetchUserData(token);
      // For now, let's decode the token (if it contains user info) or set a placeholder
      // This is a simplified example, proper JWT decoding should be done carefully
      try {
        // WARNING: Basic decoding, not secure validation!
        const decodedUser = JSON.parse(atob(token.split('.')[1])); 
        setUser({ id: decodedUser.id, username: decodedUser.username, role: decodedUser.role }); 
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem('authToken'); // Remove invalid token
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      // Replace with your actual backend API endpoint
      const response = await axios.post('/api/auth/login', { username, password }); 
      const { token, user: userData } = response.data;
      
      localStorage.setItem('authToken', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);
      return true; // Indicate successful login
    } catch (error) {
      console.error('Login failed:', error.response ? error.response.data : error.message);
      return false; // Indicate failed login
    }
  };

  const register = async (userData) => {
    try {
      // Replace with your actual backend API endpoint
      await axios.post('/api/auth/register', userData);
      // Optionally automatically log in the user after registration
      // await login(userData.username, userData.password);
      return true; // Indicate successful registration
    } catch (error) {
      console.error('Registration failed:', error.response ? error.response.data : error.message);
      return false; // Indicate failed registration
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  // Function to fetch user data based on token (example)
  // const fetchUserData = async (token) => {
  //   try {
  //     axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  //     const response = await axios.get('/api/auth/me'); // Your endpoint to get user data
  //     setUser(response.data);
  //   } catch (error) {
  //     console.error('Failed to fetch user data:', error);
  //     logout(); // Log out if token is invalid or fetching fails
  //   }
  // };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};


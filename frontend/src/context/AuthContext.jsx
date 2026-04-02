import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Axios instance (stable)
  const api = React.useMemo(() => axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  }), []);

  // Update token in api headers whenever token changes
  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          setToken(null);
          setUser(null);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          toast.error('Session expired. Please log in again.');
        }
        return Promise.reject(error);
      }
    );

    // Cleanup interceptors on unmount or token change
    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [token, api]);

  useEffect(() => {
    // In a real app we'd /me to get user details, using local storage state for now
    if (token) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      setToken(res.data.token);
      setUser(res.data);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      navigate('/');
      toast.success('Successfully logged in!');
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      setToken(res.data.token);
      setUser(res.data);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      navigate('/');
      toast.success('Account created successfully!');
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    toast.info('Logged out.');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, api }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

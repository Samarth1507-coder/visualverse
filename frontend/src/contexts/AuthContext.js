import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import axios from 'axios';

// Create Auth Context
const AuthContext = createContext();

// Initial state
const initialState = {
  user: { username: 'Guest', isGuest: true },
  token: localStorage.getItem('token') || null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Action types
const AUTH_ACTIONS = {
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAIL: 'LOGIN_FAIL',
  LOGOUT: 'LOGOUT',
  USER_LOADED: 'USER_LOADED',
  AUTH_ERROR: 'AUTH_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_LOADING: 'SET_LOADING',
  SIGNUP_SUCCESS: 'SIGNUP_SUCCESS',
  SIGNUP_FAIL: 'SIGNUP_FAIL',
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_SUCCESS:
    case AUTH_ACTIONS.SIGNUP_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case AUTH_ACTIONS.USER_LOADED:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !action.payload.isGuest,
        loading: false,
        error: null,
      };
    case AUTH_ACTIONS.LOGIN_FAIL:
    case AUTH_ACTIONS.SIGNUP_FAIL:
    case AUTH_ACTIONS.AUTH_ERROR:
    case AUTH_ACTIONS.LOGOUT:
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        user: { username: 'Guest', isGuest: true },
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };
    case AUTH_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    case AUTH_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

// Set auth token in axios headers
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Auth Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user from backend (or fallback to guest)
  const loadUser = useCallback(async () => {
    if (!state.token) {
      dispatch({ type: AUTH_ACTIONS.USER_LOADED, payload: { username: 'Guest', isGuest: true } });
      return;
    }

    setAuthToken(state.token);
    try {
      const res = await axios.get('/api/auth/me');
      if (res.data?.data?.user) {
        dispatch({ type: AUTH_ACTIONS.USER_LOADED, payload: res.data.data.user });
      } else {
        dispatch({ type: AUTH_ACTIONS.AUTH_ERROR, payload: 'Failed to load user' });
      }
    } catch (err) {
      dispatch({ type: AUTH_ACTIONS.AUTH_ERROR, payload: err.response?.data?.message || 'Failed to load user' });
    }
  }, [state.token]);

  // Login function
  const login = async (email, password) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      if (!res.data.token || !res.data.user) throw new Error('Invalid response from server');
      dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: res.data });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Login failed';
      dispatch({ type: AUTH_ACTIONS.LOGIN_FAIL, payload: message });
      return { success: false, error: message };
    }
  };

  // Signup function
  const signup = async (formData) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    try {
      const res = await axios.post('/api/auth/register', formData);
      if (!res.data.token || !res.data.user) throw new Error('Invalid response from server');
      dispatch({ type: AUTH_ACTIONS.SIGNUP_SUCCESS, payload: res.data });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Signup failed';
      dispatch({ type: AUTH_ACTIONS.SIGNUP_FAIL, payload: message });
      return { success: false, error: message };
    }
  };

  // Logout function
  const logout = () => {
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  // Clear errors
  const clearError = () => dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

  // Load user on mount or token change
  useEffect(() => {
    loadUser();
  }, [loadUser, state.token]);

  // Sync axios headers with token
  useEffect(() => {
    setAuthToken(state.token);
  }, [state.token]);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        error: state.error,
        login,
        logout,
        signup,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

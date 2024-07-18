import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line import/no-unresolved
import { useGetMeQuery } from 'store/reducers/userApi';
import React, { useState, useEffect, useContext, useCallback, createContext, useMemo } from 'react';
// eslint-disable-next-line import/no-unresolved
import { useLoginMutation, useLogoutMutation, useRegisterMutation } from 'store/reducers/authApi';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState('loading');
  const [user, setUser] = useState(null);
  const [login] = useLoginMutation();
  const {
    data: userData,
    refetch,
    isFetching,
    isLoading,
  } = useGetMeQuery(null, {
    skip: isAuthenticated || !localStorage.getItem('authToken'),
  });
  const [logout] = useLogoutMutation();
  const [register] = useRegisterMutation();

  useEffect(() => {
    if (userData) {
      setUser(userData);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, [userData]);

  const handleLogin = async (credentials) => {
    try {
      const { access_token } = await login(credentials).unwrap();
      localStorage.setItem('authToken', access_token);
      const { data } = await refetch();
      setUser(() => data);
      setIsAuthenticated(true);
      return null;
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      return error;
    }
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      localStorage.removeItem('authToken');
      setIsAuthenticated(false);
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const refreshAuthState = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleRegister = async (credentials) => {
    try {
      await register(credentials).unwrap();
      const { access_token } = await login({
        username: credentials.email,
        password: credentials.password,
      }).unwrap();
      localStorage.setItem('authToken', access_token);
      const { data } = await refetch();
      setUser(() => data);
      setIsAuthenticated(true);
      return null;
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      return error;
    }
  };

  const value = useMemo(
    () => ({
      isAuthenticated,
      user,
      login: handleLogin,
      logout: handleLogout,
      register: handleRegister,
      refreshAuthState,
    }),
    [isAuthenticated, user, handleLogin, handleLogout, handleRegister, refreshAuthState]
  );

  if (isFetching || isLoading) {
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
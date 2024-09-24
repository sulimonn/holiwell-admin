import PropTypes from 'prop-types';
import React, { useMemo, useState, useEffect, useContext, useCallback, createContext } from 'react';

import { useRouter } from 'src/routes/hooks';

import { useGetMeQuery } from 'src/store/reducers/users';
import { useLoginMutation, useLogoutMutation, useRegisterMutation } from 'src/store/reducers/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState();
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

  const router = useRouter();

  useEffect(() => {
    // Check if there is no auth token, redirect immediately
    if (!localStorage.getItem('authToken')) {
      router.push('/login');
      return;
    }

    // If still fetching or loading, do not perform any redirection yet
    if (isFetching || isLoading) {
      return;
    }

    if (userData) {
      setUser(userData);
      setIsAuthenticated(true);
      if (userData.is_superuser) {
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setUser(null);
        router.push('/login');
      }
    }
  }, [userData, isFetching, isLoading, router]);

  const handleLogin = useCallback(
    async (credentials) => {
      try {
        const { access_token } = await login(credentials).unwrap();
        localStorage.setItem('authToken', access_token);
        setIsAuthenticated(true);
        return null;
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
        return error;
      }
    },
    [login]
  );

  const handleLogout = useCallback(async () => {
    try {
      await logout().unwrap();
      localStorage.removeItem('authToken');
      setIsAuthenticated(false);
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  }, [logout, router]);

  const refreshAuthState = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleRegister = useCallback(
    async (credentials) => {
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
    },
    [register, login, refetch]
  );

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

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export default AuthProvider;

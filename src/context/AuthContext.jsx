import { createContext, useState, useEffect, useContext } from 'react';
import { authenticateUser, getUserById } from '../utils/localStorage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const userId = JSON.parse(storedUser).id;
      const user = getUserById(userId);
      setCurrentUser(user);
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const user = authenticateUser(email, password);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify({ id: user.id }));
      return user;
    }
    return null;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const value = {
    currentUser,
    login,
    logout,
    isAdmin: currentUser?.role === 'admin',
    isEmployee: currentUser?.role === 'employee',
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Mock user - set default to student for demo
  const [user, setUser] = useState({
    id: '1',
    name: 'John Student',
    email: 'student@example.com',
    role: 'student',
    studentId: 'STU001',
    department: 'Computer Science'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // No backend calls needed
    setLoading(false);
  }, []);

  const login = async (email, password, role) => {
    // Mock login - just set user based on role
    if (role === 'student') {
      setUser({
        id: '1',
        name: 'John Student',
        email: 'student@example.com',
        role: 'student',
        studentId: 'STU001',
        department: 'Computer Science'
      });
    } else {
      setUser({
        id: '2',
        name: 'Dr. Jane Teacher',
        email: 'teacher@example.com',
        role: 'teacher',
        department: 'Computer Science'
      });
    }
    return user;
  };

  const register = async (userData, role) => {
    // Mock registration
    return login(userData.email, userData.password, role);
  };

  const logout = () => {
    // Keep user logged in for demo purposes
    // Could reset to student if needed
  };

  const switchRole = (role) => {
    if (role === 'student') {
      setUser({
        id: '1',
        name: 'John Student',
        email: 'student@example.com',
        role: 'student',
        studentId: 'STU001',
        department: 'Computer Science'
      });
    } else {
      setUser({
        id: '2',
        name: 'Dr. Jane Teacher',
        email: 'teacher@example.com',
        role: 'teacher',
        department: 'Computer Science'
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

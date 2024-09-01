import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);  // null initially indicating no user is logged in

    const login = (userData) => {
        setUser(userData);  // Update with user data when logged in
        localStorage.setItem('token', userData.token);  // Optional: Store token in local storage
    };

    const logout = () => {
        setUser(null);  // Clear user data when logging out
        localStorage.removeItem('token');  // Optional: Remove token from local storage
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

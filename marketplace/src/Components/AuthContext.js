import React, { createContext, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login as loginAction, logout as logoutAction } from './store/authSlice';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const dispatch = useDispatch();
    const { username, userRole } = useSelector((state) => state.auth);

    const login = (role) => {
        dispatch(loginAction({ username: role.username, userRole: role.userRole }));
    };

    const logout = () => {
        dispatch(logoutAction());
    };

    return (
        <AuthContext.Provider value={{ loggedIn: !!username, userRole, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

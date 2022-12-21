import React, { useState, useEffect, createContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { api, createSession } from '../services/Api';

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => { 
        const recoveredUser = localStorage.getItem('user');
        if (recoveredUser) {
            setUser(JSON.parse(recoveredUser))
        }
        setLoading(false)
    }, []);
    const login = async (email, password) => {
      //api criar uma session
      const response = await createSession(email, password);
      console.log("login", response.data);

        const loggedUser = response.data.user;
        const token = response.data.token;
        localStorage.setItem("user", JSON.stringify(loggedUser));
        localStorage.setItem("token", token)

        api.defaults.headers.Authorization = `Bearer ${token}`;

      if (password === "secret") {
        setUser(loggedUser);
        navigate("/");
      }
    };
    const logout = () => {
        console.log("logout");
        setUser(null)
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        api.defaults.headers.Authorization = null
        navigate("/login");
    };
    return (
        <AuthContext.Provider
          value={{ authenticated: !!user, user, loading, login, logout }}
        > {children}</AuthContext.Provider>
    )
}
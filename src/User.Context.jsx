import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        const fetchUser = async () => {
            if (!token) {
                setUser(null);
                return;
            }
            try {
                const response = await axios.get('http://localhost:3000/users/me/me', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(response.data);
            } catch (error) {
                console.error('Kullanıcılar alınamadı:', error);
                setUser(null); 
            }
        };
        fetchUser();
    }, [token]); 
    
    useEffect(() => {
        const handleStorageChange = () => {
            setToken(localStorage.getItem('token'));
        };
    
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);
    return (
        <UserContext.Provider value={{ user, setUser }}>
        {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);

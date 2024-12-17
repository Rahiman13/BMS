import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../../../api';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);

    // Fetch favorites when component mounts
    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            fetchFavorites(userId);
        }
    }, []);

    const fetchFavorites = async (userId) => {
        try {
            const response = await axios.get(`${API_URL}/api/favorites/${userId}`);
            setFavorites(response.data);
        } catch (error) {
            console.error('Error fetching favorites:', error);
        }
    };

    const toggleFavorite = async (book) => {
        const userId = localStorage.getItem('userId');
        if (!userId) return;

        try {
            if (isFavorite(book._id)) {
                // Remove from favorites
                await axios.delete(`${API_URL}/api/favorites/${userId}/${book._id}`);
                setFavorites(prevFavorites => 
                    prevFavorites.filter(fav => fav._id !== book._id)
                );
            } else {
                // Add to favorites
                await axios.post(`${API_URL}/api/favorites/${userId}`, { bookId: book._id });
                setFavorites(prevFavorites => [...prevFavorites, book]);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    const isFavorite = (bookId) => {
        return favorites.some(book => book._id === bookId);
    };

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
};

import React, { useContext, useEffect, useState } from 'react';
import { FavoritesContext } from './FavoritesContext';
import Swal from 'sweetalert2';
import Navbar from '../../Navbar/Navbar';
import { BsHeartFill } from 'react-icons/bs';
import axios from 'axios';
import API_URL from '../../../api';
import { useNavigate } from 'react-router-dom';

const Favorites = () => {
    const { favorites, toggleFavorite } = useContext(FavoritesContext);
    const navigate = useNavigate();

    const handleViewMore = (book) => {
        Swal.fire({
            title: book.title,
            html: `
                <div style="text-align: left;">
                    <p><strong style="font-size: 18px; font-weight: semibold;">Summary:</strong></p>
                    <p>${book.summary}</p>
                </div>
            `,
            imageUrl: book.imageUrl,
            imageWidth: 400,
            imageHeight: 400,
            imageAlt: 'Book cover',
            confirmButtonText: 'Close',
            showCancelButton: true,
            cancelButtonText: 'Buy',
        }).then((result) => {
            if (result.dismiss === Swal.DismissReason.cancel) {
                handleBuy(book);
            }
        });
    };

    const handleBuy = async (book) => {
        const userId = localStorage.getItem('userId');
    
        if (!userId) {
            // Redirect to login page or handle not logged in scenario
            navigate('/login');
            return;
        }
    
        try {
            const { value: copiesAvailable } = await Swal.fire({
                title: 'Enter number of copies to purchase:',
                input: 'number',
                inputValue: 1,
                inputAttributes: {
                    min: 1,
                    max: book.copiesAvailable,
                    step: 1,
                },
                inputValidator: (value) => {
                    if (!value || value < 1 || value > book.copiesAvailable) {
                        return 'Please enter a valid number of copies';
                    }
                },
                showCancelButton: true,
                confirmButtonText: 'Confirm Purchase',
            });
    
            if (copiesAvailable) {
                const purchaseData = {
                    userId,
                    bookTitle: book.title,
                    bookimageUrl: book.imageUrl,
                    author: book.author,
                    price: book.price,
                    quantity: parseInt(copiesAvailable),
                    totalPrice: book.price * parseInt(copiesAvailable),
                    purchasedDate: new Date().toISOString(),
                };
    
                const response = await axios.post(`${API_URL}/api/purchase`, purchaseData);
    
                if (response.status === 201) {
                    // Remove from favorites list if present
                    const isFavorite = favorites.some(fav => fav._id === book._id);
                    if (isFavorite) {
                        const updatedFavoritesList = favorites.filter(fav => fav._id !== book._id);
                        setFavorites(updatedFavoritesList);
                        const favoriteIds = updatedFavoritesList.map(fav => fav._id);
                        localStorage.setItem('favorites', JSON.stringify(favoriteIds));
                    }
    
                    Swal.fire('Purchased!', `You have successfully purchased "${book.title}".`, 'success');
                } else {
                    Swal.fire('Error!', 'Failed to complete purchase', 'error');
                }
            }
        } catch (error) {
            console.error('Error purchasing book:', error);
            Swal.fire('Error!', 'Failed to complete purchase', 'error');
        }
    };

    const handleToggleFavorite = async (book) => {
        await toggleFavorite(book);
    };

    return (
        <>
            <Navbar />
            <div className="container mx-auto mt-24 px-4">
                <h1 className="text-4xl sm:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    My Favorite Books
                </h1>
                
                {favorites.length === 0 ? (
                    <div className="text-center py-16">
                        <BsHeartFill className="mx-auto text-6xl text-gray-300 mb-4" />
                        <p className="text-xl text-gray-500">No favorite books yet. Start adding some!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {favorites.map((book) => (
                            <div key={book._id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                                <div className="relative group">
                                    <img
                                        src={book.imageUrl}
                                        alt={book.title}
                                        className="w-full h-56 sm:h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                                        onClick={() => handleViewMore(book)}
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <button
                                            className="bg-white text-gray-800 px-6 py-2 rounded-full font-semibold transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
                                            onClick={() => handleViewMore(book)}
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-3">
                                        <h2 className="text-xl font-bold text-gray-800 leading-tight hover:text-blue-600 transition-colors duration-200">
                                            {book.title}
                                        </h2>
                                        <button
                                            className="text-2xl hover:scale-110 transition-transform duration-200"
                                            onClick={() => handleToggleFavorite(book)}
                                        >
                                            <BsHeartFill className="text-red-500" />
                                        </button>
                                    </div>
                                    
                                    <div className="space-y-2 mb-4">
                                        <p className="text-gray-600"><span className="font-semibold">Author:</span> {book.author}</p>
                                        <p className="text-gray-600"><span className="font-semibold">Available:</span> {book.copiesAvailable}</p>
                                        <p className="text-2xl font-bold text-blue-600">₹{book.price}</p>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2.5 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg"
                                            onClick={() => handleBuy(book)}
                                        >
                                            Buy Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default Favorites;

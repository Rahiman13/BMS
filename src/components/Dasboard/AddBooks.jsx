import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Navbar from '../Navbar/Navbar_admin';
import AddBooks_bg from '../assets/AddBooks_bg.jpg';
import API_URL from '../../api';

const AddBooksForm = () => {
  const [bookData, setBookData] = useState({
    title: '',
    summary: '',
    imageUrl: '',
    price: '',
    totalCopies: '',
    copiesAvailable: '',
    genre: '',
    publisherName: '',
    authorName: '',
    authorBio: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddBook = async () => {
    // Validation
    if (!bookData.title || !bookData.authorName || !bookData.publisherName) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Title, Author Name, and Publisher Name are required',
      });
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/books`, {
        ...bookData,
        price: parseFloat(bookData.price),
        totalCopies: parseInt(bookData.totalCopies),
        copiesAvailable: parseInt(bookData.copiesAvailable || bookData.totalCopies)
      });

      if (response.status === 201) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Book added successfully',
        });

        // Reset form
        setBookData({
          title: '',
          summary: '',
          imageUrl: '',
          price: '',
          totalCopies: '',
          copiesAvailable: '',
          genre: '',
          publisherName: '',
          authorName: '',
          authorBio: ''
        });
      }
    } catch (error) {
      console.error('Error adding book:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to add book',
      });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#0A0F1C]">
      <Navbar className="w-full lg:w-1/4" />
      <div className="container-fluid w-full mx-auto bg-cover bg-center h-auto bg-fixed relative" 
           style={{ backgroundImage: `url(${AddBooks_bg})` }}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-purple-600/30 to-pink-600/30 animate-gradient-xy"></div>

        <div className="relative z-10 w-full lg:w-3/4 mx-auto p-8 lg:p-12">
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-text">
              Add New Book
            </h1>
            <p className="text-gray-300 text-lg">Expand your library with new titles</p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-[0_0_40px_rgba(192,219,255,0.2)] hover:shadow-[0_0_50px_rgba(192,219,255,0.3)] transition-all duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-gray-300 text-sm ml-2">Book Title</label>
                <input
                  type="text"
                  name="title"
                  value={bookData.title}
                  onChange={handleInputChange}
                  placeholder="Enter book title"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 p-4 rounded-2xl
                           focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                           transition-all duration-300 hover:bg-white/10 hover:border-purple-500/50"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-gray-300 text-sm ml-2">Author Name</label>
                <input
                  type="text"
                  name="authorName"
                  value={bookData.authorName}
                  onChange={handleInputChange}
                  placeholder="Enter author name"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 p-4 rounded-2xl
                           focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                           transition-all duration-300 hover:bg-white/10 hover:border-purple-500/50"
                />
              </div>
              <input
                type="text"
                name="publisherName"
                value={bookData.publisherName}
                onChange={handleInputChange}
                placeholder="Publisher Name"
                className="bg-white/10 border-0 text-white placeholder-gray-400 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 hover:bg-white/20"
              />
              <input
                type="text"
                name="genre"
                value={bookData.genre}
                onChange={handleInputChange}
                placeholder="Genre"
                className="bg-white/10 border-0 text-white placeholder-gray-400 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 hover:bg-white/20"
              />
              <input
                type="number"
                name="price"
                value={bookData.price}
                onChange={handleInputChange}
                placeholder="Price"
                className="bg-white/10 border-0 text-white placeholder-gray-400 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 hover:bg-white/20"
              />
              <input
                type="number"
                name="totalCopies"
                value={bookData.totalCopies}
                onChange={handleInputChange}
                placeholder="Total Copies"
                className="bg-white/10 border-0 text-white placeholder-gray-400 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 hover:bg-white/20"
              />
              <input
                type="text"
                name="imageUrl"
                value={bookData.imageUrl}
                onChange={handleInputChange}
                placeholder="Image URL"
                className="bg-white/10 border-0 text-white placeholder-gray-400 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 hover:bg-white/20"
              />
              <input
                type="number"
                name="copiesAvailable"
                value={bookData.copiesAvailable}
                onChange={handleInputChange}
                placeholder="Copies Available (Optional)"
                className="bg-white/10 border-0 text-white placeholder-gray-400 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 hover:bg-white/20"
              />
            </div>

            <div className="mt-8 space-y-6">
              <div className="space-y-2">
                <label className="text-gray-300 text-sm ml-2">Author Bio</label>
                <textarea
                  name="authorBio"
                  value={bookData.authorBio}
                  onChange={handleInputChange}
                  placeholder="Tell us about the author..."
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 p-4 rounded-2xl
                           focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                           transition-all duration-300 hover:bg-white/10 hover:border-purple-500/50 min-h-[120px]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray-300 text-sm ml-2">Book Summary</label>
                <textarea
                  name="summary"
                  value={bookData.summary}
                  onChange={handleInputChange}
                  placeholder="Write a compelling summary..."
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 p-4 rounded-2xl
                           focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                           transition-all duration-300 hover:bg-white/10 hover:border-purple-500/50 min-h-[120px]"
                />
              </div>
            </div>

            <div className="flex justify-end mt-10">
              <button
                onClick={handleAddBook}
                className="group relative inline-flex items-center px-12 py-4 rounded-2xl
                         bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500
                         text-white font-semibold text-lg tracking-wider
                         transition-all duration-500 ease-in-out
                         hover:scale-105 hover:shadow-[0_0_40px_rgba(167,139,250,0.5)]
                         focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                <span className="relative">Add Book</span>
                <span className="absolute right-4 transform group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBooksForm;

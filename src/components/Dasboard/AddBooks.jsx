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
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 w-full lg:w-4/5 xl:w-3/4 mx-auto p-4 lg:p-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
              Add New Book
            </h1>
            <p className="text-gray-200 text-lg font-medium">Expand your library with new titles</p>
          </div>

          <div className="bg-gray-900/90 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-gray-700 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 p-4 bg-gray-800/50 rounded-xl mb-6">
                <h2 className="text-white text-xl font-semibold mb-4">Required Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-gray-200 font-medium">Book Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={bookData.title}
                      onChange={handleInputChange}
                      placeholder="Enter book title"
                      className="w-full bg-gray-800 border border-gray-600 text-white placeholder-gray-400 p-3 rounded-xl
                               focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                               transition-all duration-300"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-gray-200 font-medium">Author Name *</label>
                    <input
                      type="text"
                      name="authorName"
                      value={bookData.authorName}
                      onChange={handleInputChange}
                      placeholder="Enter author name"
                      className="w-full bg-gray-800 border border-gray-600 text-white placeholder-gray-400 p-3 rounded-xl
                               focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                               transition-all duration-300"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-gray-200 font-medium">Publisher Name *</label>
                <input
                  type="text"
                  name="publisherName"
                  value={bookData.publisherName}
                  onChange={handleInputChange}
                  placeholder="Publisher Name"
                  className="w-full bg-gray-800 border border-gray-600 text-white placeholder-gray-400 p-3 rounded-xl
                           focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                           transition-all duration-300"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray-200 font-medium">Genre</label>
                <input
                  type="text"
                  name="genre"
                  value={bookData.genre}
                  onChange={handleInputChange}
                  placeholder="Genre"
                  className="w-full bg-gray-800 border border-gray-600 text-white placeholder-gray-400 p-3 rounded-xl
                           focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                           transition-all duration-300"
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray-200 font-medium">Price</label>
                <input
                  type="number"
                  name="price"
                  value={bookData.price}
                  onChange={handleInputChange}
                  placeholder="Price"
                  className="w-full bg-gray-800 border border-gray-600 text-white placeholder-gray-400 p-3 rounded-xl
                           focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                           transition-all duration-300"
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray-200 font-medium">Total Copies</label>
                <input
                  type="number"
                  name="totalCopies"
                  value={bookData.totalCopies}
                  onChange={handleInputChange}
                  placeholder="Total Copies"
                  className="w-full bg-gray-800 border border-gray-600 text-white placeholder-gray-400 p-3 rounded-xl
                           focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                           transition-all duration-300"
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray-200 font-medium">Image URL</label>
                <input
                  type="text"
                  name="imageUrl"
                  value={bookData.imageUrl}
                  onChange={handleInputChange}
                  placeholder="Image URL"
                  className="w-full bg-gray-800 border border-gray-600 text-white placeholder-gray-400 p-3 rounded-xl
                           focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                           transition-all duration-300"
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray-200 font-medium">Copies Available (Optional)</label>
                <input
                  type="number"
                  name="copiesAvailable"
                  value={bookData.copiesAvailable}
                  onChange={handleInputChange}
                  placeholder="Copies Available (Optional)"
                  className="w-full bg-gray-800 border border-gray-600 text-white placeholder-gray-400 p-3 rounded-xl
                           focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                           transition-all duration-300"
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-6 mt-6">
              <div className="space-y-2">
                <label className="text-gray-200 font-medium">Author Bio</label>
                <textarea
                  name="authorBio"
                  value={bookData.authorBio}
                  onChange={handleInputChange}
                  placeholder="Tell us about the author..."
                  className="w-full bg-gray-800 border border-gray-600 text-white placeholder-gray-400 p-4 rounded-xl
                           focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                           transition-all duration-300 min-h-[120px] resize-y"
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray-200 font-medium">Book Summary</label>
                <textarea
                  name="summary"
                  value={bookData.summary}
                  onChange={handleInputChange}
                  placeholder="Write a compelling summary..."
                  className="w-full bg-gray-800 border border-gray-600 text-white placeholder-gray-400 p-4 rounded-xl
                           focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                           transition-all duration-300 min-h-[120px] resize-y"
                />
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={handleAddBook}
                className="group relative inline-flex items-center px-8 py-3 rounded-xl
                         bg-gradient-to-r from-purple-600 to-purple-800
                         text-white font-semibold text-lg
                         transition-all duration-300
                         hover:from-purple-700 hover:to-purple-900
                         focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                <span className="relative">Add Book</span>
                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBooksForm;

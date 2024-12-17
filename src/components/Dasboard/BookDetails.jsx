import React, { useState, useEffect } from 'react';
import Navbar_admin from '../Navbar/Navbar_admin';
import Books_charts from './charts/books_charts';
import { FaEdit, FaTrash, FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import EditBookModal from './EditBookModal';
import API_URL from '../../api';

const BookDetails = () => {
    const [books, setBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentBooks = books.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(books.length / itemsPerPage);

    // Fetch books function
    const fetchBooks = async () => {
        try {
            const response = await fetch(`${API_URL}/api/books`);
            if (response.ok) {
                const bookData = await response.json();
                setBooks(bookData);
            } else {
                toast.error('Failed to fetch books');
            }
        } catch (error) {
            console.error('Error fetching books:', error);
            toast.error('Error fetching books');
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleEditClick = (book) => {
        setSelectedBook(book);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = async (id) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            });

            if (result.isConfirmed) {
                // Show loading state
                Swal.fire({
                    title: 'Deleting...',
                    text: 'Please wait while we delete the book',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                const response = await fetch(`${API_URL}/api/books/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    // Remove the deleted book from the state
                    setBooks(books.filter(book => book.id !== id));
                    
                    await Swal.fire({
                        icon: 'success',
                        title: 'Deleted!',
                        text: 'Book has been deleted successfully.',
                        timer: 2000,
                        showConfirmButton: false
                    });
                    
                    toast.success('Book deleted successfully');
                    
                    // Refresh the books list
                    await fetchBooks();
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to delete book');
                }
            }
        } catch (error) {
            console.error('Error deleting book:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: error.message || 'Failed to delete book',
                confirmButtonText: 'OK'
            });
            toast.error('Failed to delete book');
        }
    };

    const handleModalClose = () => {
        setIsEditModalOpen(false);
        setSelectedBook(null);
    };

    const handleBookUpdate = async (updatedBook) => {
        if (updatedBook && updatedBook.id) {
            // Refresh the books list after update
            await fetchBooks();
        }
        handleModalClose();
    };

    return (
        <>
            <div className="flex flex-col-2 lg:flex-row min-h-screen bg-gray-50">
                <Navbar_admin />
                <div className="container mx-auto px-6 py-8 flex-grow">
                    <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 font-cursive">
                        Library Collection
                    </h1>
                    
                    <div className="container flex flex-col-2 lg:flex-row mb-8 justify-center items-center">
                        <Books_charts />
                    </div>

                    {/* Table Controls */}
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center space-x-2">
                            <label className="text-gray-600">Show entries:</label>
                            <select
                                className="border rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={itemsPerPage}
                                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                            >
                                {[5, 10, 15, 20].map(size => (
                                    <option key={size} value={size}>{size}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Enhanced Table */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-800 text-white">
                                    <th className="px-6 py-3 text-left">S.No</th>
                                    <th className="px-6 py-3 text-left">Book Name</th>
                                    <th className="px-6 py-3 text-left">Author Name</th>
                                    <th className="px-6 py-3 text-left">Copies</th>
                                    <th className="px-6 py-3 text-left">Genre</th>
                                    <th className="px-6 py-3 text-left">Price</th>
                                    <th className="px-6 py-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {currentBooks.map((book, index) => (
                                    <tr key={book.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">{indexOfFirstItem + index + 1}</td>
                                        <td className="px-6 py-4 font-medium">{book.title}</td>
                                        <td className="px-6 py-4">{book.authorName}</td>
                                        <td className="px-6 py-4">{book.copiesAvailable}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                                                {book.genre}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">${book.price}</td>
                                        <td className="px-6 py-4 text-center">
                                            <button 
                                                onClick={() => handleEditClick(book)}
                                                className="text-blue-500 hover:text-blue-700 mx-2 transition-colors"
                                            >
                                                <FaEdit size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteClick(book.id)}
                                                className="text-red-500 hover:text-red-700 mx-2 transition-colors"
                                            >
                                                <FaTrash size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex justify-between items-center mt-4">
                        <div className="text-gray-600">
                            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, books.length)} of {books.length} entries
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 rounded-lg bg-gray-800 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
                            >
                                <FaAngleLeft />
                            </button>
                            {[...Array(totalPages)].map((_, index) => (
                                <button
                                    key={index + 1}
                                    onClick={() => setCurrentPage(index + 1)}
                                    className={`px-4 py-2 rounded-lg transition-colors ${
                                        currentPage === index + 1
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-200 hover:bg-gray-300'
                                    }`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 rounded-lg bg-gray-800 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
                            >
                                <FaAngleRight />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {isEditModalOpen && (
                <EditBookModal
                    book={selectedBook}
                    onClose={handleModalClose}
                    onUpdate={handleBookUpdate}
                    fetchBooks={fetchBooks}
                />
            )}
        </>
    );
};

export default BookDetails;

import React, { useEffect, useState } from 'react';
import NavBar from './Navbar_admin';
import API_URL from '../../api';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBell, FiMail, FiUser, FiCalendar, FiChevronLeft, FiChevronRight, FiFilter } from 'react-icons/fi';
import { format } from 'date-fns';

const Notifications = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchEnquiries = async () => {
            try {
                const response = await fetch(`${API_URL}/api/feedback`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                    },
                });
                const data = await response.json();
                setEnquiries(data.data || []);
            } catch (error) {
                console.error('Error fetching enquiries:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEnquiries();
    }, [userId]);

    // Pagination calculations
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = enquiries.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(enquiries.length / itemsPerPage);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1); // Reset to first page when changing items per page
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.3 }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
            <div className="flex flex-col lg:flex-row">
                <NavBar />
                <div className="flex-1 px-4 lg:px-8 py-8">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="max-w-7xl mx-auto"
                    >
                        {/* Header Section */}
                        <div className="mb-8 bg-white rounded-2xl p-6 shadow-lg backdrop-blur-lg bg-opacity-90">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div className="mb-4 md:mb-0">
                                    <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center">
                                        <FiBell className="mr-3 text-blue-600" />
                                        Notifications
                                    </h2>
                                    <p className="text-gray-600 mt-2">
                                        View and manage all user feedback and enquiries
                                    </p>
                                </div>

                                {/* Items per page selector with fancy styling */}
                                <div className="flex items-center space-x-4 bg-gray-50 p-3 rounded-xl">
                                    <FiFilter className="text-blue-600" />
                                    <select
                                        value={itemsPerPage}
                                        onChange={handleItemsPerPageChange}
                                        className="bg-transparent border-none focus:outline-none text-gray-700 font-medium"
                                    >
                                        {[5, 10, 15, 20].map(number => (
                                            <option key={number} value={number}>
                                                {number} items
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Loading State */}
                        {isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="relative">
                                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                                    <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin absolute top-0 left-0 animate-ping"></div>
                                </div>
                            </div>
                        ) : enquiries.length === 0 ? (
                            <motion.div
                                variants={itemVariants}
                                className="bg-white rounded-2xl shadow-xl p-12 text-center backdrop-blur-lg bg-opacity-90"
                            >
                                <div className="relative w-24 h-24 mx-auto mb-6">
                                    <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
                                    <div className="relative bg-white rounded-full p-6">
                                        <FiBell className="w-12 h-12 text-blue-600" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                                    No Notifications Yet
                                </h3>
                                <p className="text-gray-600">
                                    When users send feedback, they will appear here.
                                </p>
                            </motion.div>
                        ) : (
                            <>
                                <AnimatePresence mode='wait'>
                                    <div className="grid gap-6">
                                        {currentItems.map((enquiry, index) => (
                                            <motion.div
                                                key={enquiry.id || index}
                                                variants={itemVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="hidden"
                                                className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden backdrop-blur-lg bg-opacity-90"
                                            >
                                                <div className="p-6">
                                                    <div className="flex flex-wrap items-start justify-between mb-4">
                                                        <div className="flex items-center mb-2 md:mb-0">
                                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mr-4 transform group-hover:rotate-12 transition-transform duration-300">
                                                                <FiUser className="text-white text-xl" />
                                                            </div>
                                                            <div>
                                                                <h3 className="font-bold text-lg text-gray-800 group-hover:text-blue-600 transition-colors">
                                                                    {enquiry.name}
                                                                </h3>
                                                                <div className="flex items-center text-gray-600 text-sm">
                                                                    <FiMail className="mr-1" />
                                                                    {enquiry.email}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-full">
                                                            <FiCalendar className="mr-2" />
                                                            {enquiry.createdAt ? 
                                                                format(new Date(enquiry.createdAt), 'MMM dd, yyyy HH:mm') 
                                                                : 'Date not available'
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-5 group-hover:from-blue-50 group-hover:to-purple-50 transition-all duration-300">
                                                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                                            {enquiry.message}
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </AnimatePresence>

                                {/* Enhanced Pagination */}
                                {totalPages > 1 && (
                                    <div className="mt-12 flex justify-center items-center">
                                        <div className="bg-white rounded-full shadow-lg p-2 flex items-center space-x-2">
                                            <button
                                                onClick={() => paginate(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className={`p-2 rounded-full transition-all duration-300 ${
                                                    currentPage === 1 
                                                        ? 'text-gray-400 cursor-not-allowed'
                                                        : 'text-blue-600 hover:bg-blue-50'
                                                }`}
                                            >
                                                <FiChevronLeft className="w-5 h-5" />
                                            </button>

                                            <div className="flex items-center space-x-2">
                                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                                    .filter(number => {
                                                        return (
                                                            number === 1 ||
                                                            number === totalPages ||
                                                            Math.abs(currentPage - number) <= 2
                                                        );
                                                    })
                                                    .map((number, index, array) => {
                                                        if (index > 0 && number - array[index - 1] > 1) {
                                                            return (
                                                                <React.Fragment key={`ellipsis-${number}`}>
                                                                    <span className="text-gray-400">•••</span>
                                                                    <button
                                                                        onClick={() => paginate(number)}
                                                                        className={`w-10 h-10 rounded-full transition-all duration-300 ${
                                                                            currentPage === number
                                                                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                                                                : 'text-gray-600 hover:bg-gray-100'
                                                                        }`}
                                                                    >
                                                                        {number}
                                                                    </button>
                                                                </React.Fragment>
                                                            );
                                                        }
                                                        return (
                                                            <button
                                                                key={number}
                                                                onClick={() => paginate(number)}
                                                                className={`w-10 h-10 rounded-full transition-all duration-300 ${
                                                                    currentPage === number
                                                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                                                        : 'text-gray-600 hover:bg-gray-100'
                                                                }`}
                                                            >
                                                                {number}
                                                            </button>
                                                        );
                                                    })}
                                            </div>

                                            <button
                                                onClick={() => paginate(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                className={`p-2 rounded-full transition-all duration-300 ${
                                                    currentPage === totalPages 
                                                        ? 'text-gray-400 cursor-not-allowed'
                                                        : 'text-blue-600 hover:bg-blue-50'
                                                }`}
                                            >
                                                <FiChevronRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Notifications;

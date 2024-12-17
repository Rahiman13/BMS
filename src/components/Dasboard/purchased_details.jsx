import React, { useState, useEffect } from 'react';
import Navbar_admin from '../Navbar/Navbar_admin';
import Purchased_charts from './charts/purchase_charts';
import axios from 'axios';
import API_URL from '../../api';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const PurchaseDetails = () => {
    const [purchaseDetails, setPurchaseDetails] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const itemsPerPageOptions = [5, 10, 15, 20, 25];

    useEffect(() => {
        fetchPurchaseDetails();
    }, []);

    const fetchPurchaseDetails = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/purchase`);
            if (response.ok) {
                const details = await response.json();
                setPurchaseDetails(details);
            } else {
                console.error('Failed to fetch purchase details');
            }
        } catch (error) {
            console.error('Error fetching purchase details:', error);
        }
    };

    const groupByUser = (details) => {
        const grouped = details.reduce((acc, detail) => {
            if (!acc[detail.userId]) {
                acc[detail.userId] = {
                    userName: detail.username,
                    purchases: {}
                };
            }


            if (!acc[detail.userId].purchases[detail.bookTitle]) {
                acc[detail.userId].purchases[detail.bookTitle] = {
                    bookTitle: detail.bookTitle,
                    author: detail.author,
                    price: detail.price,
                    quantity: 0,
                    totalPrice: 0,
                    purchasedDates: []
                };
            }

            acc[detail.userId].purchases[detail.bookTitle].quantity += detail.quantity;
            acc[detail.userId].purchases[detail.bookTitle].totalPrice += detail.totalPrice;
            acc[detail.userId].purchases[detail.bookTitle].purchasedDates.push(new Date(detail.purchasedDate).toLocaleDateString());

            return acc;
        }, {});
        return Object.values(grouped);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const groupedData = groupByUser(purchaseDetails);
    const currentItems = groupedData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(groupedData.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <>
            <div className="flex flex-col lg:flex-row">
                <Navbar_admin />
                <div className="container mx-auto mt-8 px-4 lg:px-16 mb-4">
                    <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
                        User Purchase Details
                    </h1>
                    
                    <div className="flex justify-end mb-4 items-center gap-2">
                        <label className="text-gray-600">Items per page:</label>
                        <select
                            className="border rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={itemsPerPage}
                            onChange={(e) => {
                                setItemsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                        >
                            {itemsPerPageOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>

                    <div className="overflow-x-auto shadow-lg rounded-lg">
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Copies</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase Dates</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {currentItems.map((user, index) => (
                                    <React.Fragment key={index}>
                                        {Object.values(user.purchases).map((purchase, idx) => (
                                            <tr 
                                                key={index + '-' + idx}
                                                className="hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {indexOfFirstItem + index + 1}
                                                </td>
                                                {idx === 0 && (
                                                    <td className="px-6 py-4 whitespace-nowrap" rowSpan={Object.values(user.purchases).length}>
                                                        <div className="text-sm font-medium text-gray-900">{user.userName}</div>
                                                    </td>
                                                )}
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{purchase.bookTitle}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{purchase.author}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{purchase.price}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{purchase.quantity}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">₹{purchase.totalPrice}</td>
                                                <td className="px-6 py-4 text-sm text-gray-500">{purchase.purchasedDates.join(', ')}</td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center justify-between mt-4 px-4">
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-3 py-1 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
                            >
                                <FiChevronLeft />
                            </button>
                            {[...Array(totalPages)].map((_, idx) => (
                                <button
                                    key={idx + 1}
                                    onClick={() => paginate(idx + 1)}
                                    className={`px-3 py-1 rounded-md ${
                                        currentPage === idx + 1
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    {idx + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
                            >
                                <FiChevronRight />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PurchaseDetails;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Navbar from '../Navbar/Navbar';
import API_URL from '../../api';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';


const MyOrders = () => {
  const [purchases, setPurchases] = useState([]);
  const [deletingPurchaseId, setDeletingPurchaseId] = useState(null);
  const [address, setAddress] = useState({
    street: '',
    landmark: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  });
  const [addresses, setAddresses] = useState([]);
  const [editingAddress, setEditingAddress] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);


  const fetchAddresses = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      toast.error('Please login to view addresses');
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/api/addresses/${userId}`);
      if (response.status === 200) {
        setAddresses(response.data);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      if (!error.response || error.response.status !== 404) {
        toast.error('Failed to fetch addresses');
      }
    }
  };
  const fetchPurchases = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      toast.error('Please login to view your orders');
      return;
    }
    try {
      const response = await axios.get(`${API_URL}/api/purchases/${userId}`);
      if (response.status === 200) {
        const purchasesData = Array.isArray(response.data) ? response.data : [];
        setPurchases(purchasesData);
      }
    } catch (error) {
      console.error('Error fetching purchase data:', error);
      toast.error('Failed to fetch orders');
      setPurchases([]);
    }
  };
  
  
  useEffect(() => {

    fetchPurchases();
    fetchAddresses();
  }, []);

  const MySwal = withReactContent(Swal);

  const handleDelete = async (purchaseId) => {
    try {
      // Show confirmation dialog using SweetAlert
      const result = await MySwal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this purchase!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it'
      });

      if (result.isConfirmed) {
        // Make backend API call to delete purchase
        await axios.delete(`${API_URL}/api/purchases/${purchaseId}`);

        // Update UI by filtering out the deleted purchase
        setPurchases(purchases.filter(purchase => purchase._id !== purchaseId));

        MySwal.fire(
          'Deleted!',
          'Your purchase has been deleted.',
          'success'
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        MySwal.fire(
          'Cancelled',
          'Your purchase is safe :)',
          'error'
        );
      }
    } catch (error) {
      console.error('Error deleting purchase:', error);
      MySwal.fire(
        'Error!',
        'An error occurred while deleting your purchase.',
        'error'
      );
    }
  };

  const handleCancelDelete = () => {
    setDeletingPurchaseId(null); // Reset deleting state
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    if (!userId) {
      toast.error('Please login to save address');
      return;
    }

    try {
      const addressData = {
        ...address,
        userId: parseInt(userId)
      };

      let response;
      if (editingAddress) {
        // Update existing address
        response = await axios.put(
          `${API_URL}/api/addresses/${editingAddress.id}`,
          addressData
        );
      } else {
        // Create new address
        response = await axios.post(
          `${API_URL}/api/addresses`,
          addressData
        );
      }

      if (response.status === 200 || response.status === 201) {
        toast.success(editingAddress ? 'Address updated successfully' : 'Address added successfully');
        setShowModal(false);
        setEditingAddress(null);
        setAddress({
          street: '',
          landmark: '',
          city: '',
          state: '',
          postalCode: '',
          country: ''
        });
        fetchAddresses(); // Refresh addresses list silently
      }
      else {
        toast.error('Failed to save address');
      }
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error('Failed to save address');
    }
  };

  const handleEditAddress = (addr) => {
    setEditingAddress(addr);
    setAddress({
      street: addr.street,
      landmark: addr.landmark,
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      country: addr.country
    });
    setShowModal(true);
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this address!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it'
      });

      if (result.isConfirmed) {
        const response = await axios.delete(`${API_URL}/api/addresses/${addressId}`);
        if (response.status === 200) {
          toast.success('Address deleted successfully');
          await fetchAddresses(); // Refresh addresses list silently
        }
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Failed to delete address');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = purchases.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(purchases.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    const maxButtons = 5; // Adjust this number to show more or fewer buttons
    const pages = [];
    
    if (totalPages <= maxButtons) {
      // If total pages is less than max buttons, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate start and end of current group
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(start + 2, totalPages - 1);
      
      // Adjust start if we're near the end
      if (end === totalPages - 1) {
        start = end - 2;
      }
      
      // Add ellipsis if needed
      if (start > 2) {
        pages.push('...');
      }
      
      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      // Add ellipsis if needed
      if (end < totalPages - 1) {
        pages.push('...');
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 mt-20 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            My Orders & Addresses
          </h1>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Address Section */}
            <div className="lg:w-1/3">
              <div className="backdrop-blur-sm bg-white/80 rounded-2xl shadow-xl p-6 border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Addresses</h2>
                  <button
                    onClick={() => {
                      setEditingAddress(null);
                      setAddress({
                        street: '',
                        landmark: '',
                        city: '',
                        state: '',
                        postalCode: '',
                        country: ''
                      });
                      setShowModal(true);
                    }}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full"
                  >
                    Add New
                  </button>
                </div>

                <div className="space-y-4">
                  {addresses.map((addr) => (
                    <div key={addr.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                      <div className="space-y-2">
                        <p className="font-medium text-gray-800">{addr.street}</p>
                        <p className="text-gray-600 text-sm">{addr.landmark}</p>
                        <p className="text-gray-600 text-sm">
                          {addr.city}, {addr.state} {addr.postalCode}
                        </p>
                        <p className="text-gray-600 text-sm">{addr.country}</p>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => handleEditAddress(addr)}
                          className="flex-1 bg-amber-500 text-white px-3 py-1.5 rounded-full text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="flex-1 bg-red-500 text-white px-3 py-1.5 rounded-full text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Orders Section */}
            <div className="lg:w-2/3">
              <div className="space-y-6">
                {/* Add items per page selector */}
                <div className="flex justify-end items-center gap-2 mb-4">
                  <label htmlFor="itemsPerPage" className="text-sm text-gray-600">
                    Items per page:
                  </label>
                  <select
                    id="itemsPerPage"
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                  </select>
                  <span className="text-sm text-gray-500">
                    Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, purchases.length)} of {purchases.length} items
                  </span>
                </div>

                {currentItems.map((purchase) => (
                  <div key={purchase._id} className="backdrop-blur-sm bg-white/80 rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition duration-300">
                    <div className="p-6 flex gap-6">
                      <div className="flex-shrink-0">
                        <img
                          src={purchase.bookimageUrl}
                          alt={purchase.bookTitle}
                          className="w-40 h-48 object-cover rounded-lg shadow-md hover:scale-105 transition duration-300"
                        />
                      </div>
                      <div className="flex-1 space-y-4">
                        <h2 className="text-2xl font-bold text-gray-800">{purchase.bookTitle}</h2>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-sm text-gray-500">Purchase Date</p>
                            <p className="font-medium">{new Date(purchase.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-sm text-gray-500">Quantity</p>
                            <p className="font-medium">{purchase.quantity} units</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3 col-span-2">
                            <p className="text-sm text-gray-500">Total Amount</p>
                            <p className="text-2xl font-bold text-blue-600">${purchase.totalPrice}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {purchases.length > itemsPerPage && (
                  <div className="flex justify-center items-center space-x-2 mt-8">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === 1
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      Previous
                    </button>
                    
                    {getPageNumbers().map((page, index) => (
                      <button
                        key={index}
                        onClick={() => typeof page === 'number' ? paginate(page) : null}
                        className={`px-4 py-2 rounded-lg ${
                          page === currentPage
                            ? 'bg-blue-500 text-white'
                            : page === '...'
                            ? 'bg-gray-100 text-gray-500 cursor-default'
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                        disabled={page === '...'}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === totalPages
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                )}

                {/* Show message when no purchases */}
                {purchases.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-lg">No orders found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal - Update with new styling */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 transform transition-all">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h2>
            <form onSubmit={handleSaveAddress} className="grid grid-cols-1 gap-4">
              <div className="">
                <div>
                  <label htmlFor="street" className="block text-gray-700 font-bold mb-2">Street</label>
                  <input
                    type="text"
                    id="street"
                    name="street"
                    value={address.street}
                    onChange={handleAddressChange}
                    className="w-full border border-gray-300 p-2 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="landmark" className="block text-gray-700 font-bold mb-2">Landmark</label>
                  <input
                    type="text"
                    id="landmark"
                    name="landmark"
                    value={address.landmark}
                    onChange={handleAddressChange}
                    className="w-full border border-gray-300 p-2 rounded-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-gray-700 font-bold mb-2">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={address.city}
                    onChange={handleAddressChange}
                    className="w-full border border-gray-300 p-2 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-gray-700 font-bold mb-2">State</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={address.state}
                    onChange={handleAddressChange}
                    className="w-full border border-gray-300 p-2 rounded-lg"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="postalCode" className="block text-gray-700 font-bold mb-2">Pincode</label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={address.postalCode}
                    onChange={handleAddressChange}
                    className="w-full border border-gray-300 p-2 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="country" className="block text-gray-700 font-bold mb-2">Country</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={address.country}
                    onChange={handleAddressChange}
                    className="w-full border border-gray-300 p-2 rounded-lg"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <button type="button" onClick={() => setShowModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-700">Cancel</button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Save Address</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </>
  );
};

export default MyOrders;

import React, { useState, useEffect, useContext } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { FavoritesContext } from '../pages/Favourite/FavoritesContext';
import Navbar from '../Navbar/Navbar';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import axios from 'axios';
import lib1 from '../assets/lib1.jpg';
import lib2 from '../assets/lib2.jpg';
import lib3 from '../assets/lib3.jpg';
import lib4 from '../assets/lib4.jpg';
import { motion } from 'framer-motion';
import ReactPaginate from 'react-paginate';
import { BsHeart, BsHeartFill, BsSearch } from 'react-icons/bs';
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import { Typewriter } from 'react-simple-typewriter';
import Services from './services';
import Gallery from './gallery';
import Testimonials from './testimonials';
import emailjs from 'emailjs-com';
import AddressModal from './AddressModal';
import { toast } from 'react-toastify';
import API_URL from '../../api';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const User = () => {
    const [books, setBooks] = useState([]);
    const { favorites, toggleFavorite } = useContext(FavoritesContext);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);
    const [userData, setUserData] = useState({});
    const [addresses, setAddresses] = useState([]);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paginationSize, setPaginationSize] = useState('large');

    useEffect(() => {
        // toast.info('Fetching data, please wait. The backend is hosted on a free platform, so it might take a while.', {
        //     position: "top-right",
        //     autoClose: 5000,
        //     hideProgressBar: false,
        //     closeOnClick: true,
        //     pauseOnHover: true,
        //     draggable: true,
        //     progress: undefined,
        // });

        // Separate promise for books
        const loadBooks = async () => {
            try {
                await fetchBooks();
            } finally {
                setLoading(false); // Set loading to false after books are fetched
            }
        };

        loadBooks(); // Start loading books immediately

        // Only fetch user data if logged in
        const userId = localStorage.getItem('userId');
        if (userId) {
            fetchUserData();
            fetchAddresses(userId);
        } else {
            toast.info('Login to access all features', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setPaginationSize(window.innerWidth < 640 ? 'small' : 'large');
        };

        handleResize(); // Initial size
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/books`);
            if (response.status === 200) {
                const booksWithGenre = response.data.map(book => ({
                    ...book,
                    genre: book.genre.toLowerCase()
                }));
                setBooks(booksWithGenre);
                setFilteredBooks(booksWithGenre);
            } else {
                console.error('Failed to fetch books data');
            }
        } catch (error) {
            console.error('Error fetching books:', error);
            toast.error('Failed to fetch books. Please try again later.');
        }
    };

    const fetchAddresses = async (userId) => {
        try {
            const response = await axios.get(`${API_URL}/api/addresses/${userId}`);
            if (response.status === 200) {
                setAddresses(response.data);
                console.log('Addresses fetched:', response.data);
            } else {
                console.error('Failed to fetch addresses');
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
        }
    };

    const fetchUserData = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error('User ID not found in localStorage');
            return;
        }
        try {
            const response = await axios.get(`${API_URL}/api/users/${userId}`);
            if (response.status === 200) {
                setUserData(response.data);
                fetchAddresses(userId);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            toast.error('Failed to fetch user data');
        }
    };

    const handleAddAddress = async (address) => {
        const userId = localStorage.getItem('userId');
        try {
            const response = await axios.post(`${API_URL}/api/users/${userId}/addresses`, address);
            if (response.status === 201) {
                fetchAddresses(userId);
                Swal.fire('Success', 'Address added successfully', 'success');
            } else {
                console.error('Failed to add address');
            }
        } catch (error) {
            console.error('Error adding address:', error);
        }
    };

    const handleEditAddress = async (addressId, updatedAddress) => {
        try {
            const response = await axios.put(`${API_URL}/api/addresses/${addressId}`, updatedAddress);
            if (response.status === 200) {
                const userId = localStorage.getItem('userId');
                fetchAddresses(userId);
                Swal.fire('Success', 'Address updated successfully', 'success');
            } else {
                console.error('Failed to update address');
            }
        } catch (error) {
            console.error('Error updating address:', error);
        }
    };

    const handleDeleteAddress = async (addressId) => {
        try {
            const response = await axios.delete(`${API_URL}/api/addresses/${addressId}`);
            if (response.status === 200) {
                const userId = localStorage.getItem('userId');
                fetchAddresses(userId);
                Swal.fire('Success', 'Address deleted successfully', 'success');
            } else {
                console.error('Failed to delete address');
            }
        } catch (error) {
            console.error('Error deleting address:', error);
        }
    };

    const handleSearch = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        setSearchTerm(searchTerm);
        const filtered = books.filter(book =>
            book.title.toLowerCase().includes(searchTerm) ||
            book.authorName.toLowerCase().includes(searchTerm) ||
            book.genre.toLowerCase().includes(searchTerm)
        );
        setFilteredBooks(filtered);
        setCurrentPage(0);
    };

    const isFavorite = (bookId) => favorites.some(book => book._id === bookId);

    const handleViewMore = (book) => {
        Swal.fire({
            title: '',
            html: `
                <div class="max-w-4xl mx-auto p-6">
                    <div class="flex flex-col md:flex-row gap-8">
                        <!-- Book Image Section -->
                        <div class="w-full md:w-1/3">
                            <div class="relative group">
                                <img 
                                    src="${book.imageUrl}" 
                                    alt="${book.title}" 
                                    class="w-full h-auto rounded-lg shadow-xl transform transition-transform duration-500 group-hover:scale-105"
                                />
                                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                            </div>
                            <div class="mt-4 flex justify-center gap-4">
                                <span class="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                                    ${book.genre}
                                </span>
                                <span class="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                                    ${book.copiesAvailable} copies left
                                </span>
                            </div>
                        </div>

                        <!-- Book Details Section -->
                        <div class="w-full md:w-2/3">
                            <h2 class="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                ${book.title}
                            </h2>
                            <p class="text-lg text-gray-600 mb-4">by <span class="font-semibold">${book.authorName}</span></p>
                            
                            <div class="flex items-center gap-4 mb-6">
                                <div class="text-2xl font-bold text-gray-900">₹${book.price}</div>
                                ${book.originalPrice ? 
                                    `<div class="text-lg text-gray-500 line-through">₹${book.originalPrice}</div>` 
                                    : ''
                                }
                                ${book.originalPrice ? 
                                    `<div class="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                                        ${Math.round((1 - book.price/book.originalPrice) * 100)}% OFF
                                    </div>` 
                                    : ''
                                }
                            </div>

                            <div class="bg-gray-50 rounded-xl p-6 mb-6">
                                <h3 class="text-xl font-semibold mb-3 text-gray-800">Summary</h3>
                                <p class="text-gray-600 leading-relaxed">
                                    ${book.summary}
                                </p>
                            </div>

                            <div class="bg-blue-50 rounded-xl p-6">
                                <h3 class="text-xl font-semibold mb-3 text-blue-800">Key Features</h3>
                                <ul class="grid grid-cols-2 gap-4">
                                    <li class="flex items-center gap-2">
                                        <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                        <span>Premium Quality Print</span>
                                    </li>
                                    <li class="flex items-center gap-2">
                                        <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                        <span>Fast Delivery</span>
                                    </li>
                                    <li class="flex items-center gap-2">
                                        <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                        <span>Money Back Guarantee</span>
                                    </li>
                                    <li class="flex items-center gap-2">
                                        <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                        <span>24/7 Support</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            showCloseButton: true,
            showConfirmButton: false,
            showCancelButton: true,
            cancelButtonText: 'Buy Now',
            cancelButtonColor: '#10B981',
            width: '80%',
            padding: '2rem',
            background: '#ffffff',
            backdrop: `
                rgba(0,0,0,0.4)
                left top
                no-repeat
            `,
            customClass: {
                container: 'custom-swal-container',
                popup: 'custom-swal-popup',
                cancelButton: 'custom-swal-cancel-button'
            },
            didOpen: () => {
                // Add custom styles to SweetAlert elements
                const popup = Swal.getPopup();
                popup.style.borderRadius = '1rem';
                
                const cancelButton = Swal.getCancelButton();
                cancelButton.style.borderRadius = '0.5rem';
                cancelButton.style.padding = '0.75rem 2rem';
                cancelButton.style.fontSize = '1.1rem';
                cancelButton.style.fontWeight = '600';
            }
        }).then((result) => {
            if (result.dismiss === Swal.DismissReason.cancel) {
                handleBuy(book);
            }
        });
    };

    const handleBuy = async (book) => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            navigate('/login');
            return;
        }

        try {
            // First check if user has any addresses
            const response = await axios.get(`${API_URL}/api/addresses/${userId}`);
            const userAddresses = response.data;

            if (!userAddresses || userAddresses.length === 0) {
                Swal.fire({
                    title: 'No Delivery Address Found',
                    text: 'Please add a delivery address to continue with your purchase',
                    icon: 'info',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Add Address',
                    cancelButtonText: 'Cancel'
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate('/myorders');
                    }
                });
                return;
            }

            // If addresses exist, show address selection dialog
            const addressOptions = userAddresses.map(addr => ({
                value: addr.id,
                text: `${addr.street}, ${addr.landmark}, ${addr.city}, ${addr.state}, ${addr.postalCode}`
            }));

            const { value: selectedAddressId } = await Swal.fire({
                title: 'Select Delivery Address',
                input: 'select',
                inputOptions: Object.fromEntries(
                    addressOptions.map(addr => [addr.value, addr.text])
                ),
                inputPlaceholder: 'Select an address',
                showCancelButton: true,
                confirmButtonText: 'Next',
                cancelButtonText: 'Add New Address',
                inputValidator: (value) => {
                    if (!value) {
                        return 'Please select an address';
                    }
                }
            });

            if (selectedAddressId) {
                const selectedAddress = userAddresses.find(addr => addr.id === parseInt(selectedAddressId));
                let quantity = 1;
                
                // Show order confirmation dialog with quantity selector
                const { value: confirmOrder, dismiss: dismissReason } = await Swal.fire({
                    title: 'Confirm Your Order',
                    html: `
                        <div class="p-4">
                            <div class="flex items-center gap-4 mb-4">
                                <img src="${book.imageUrl}" alt="${book.title}" class="w-24 h-32 object-cover rounded-lg"/>
                                <div>
                                    <h3 class="text-lg font-semibold">${book.title}</h3>
                                    <p class="text-gray-600">by ${book.authorName}</p>
                                    <p class="text-blue-600 font-bold">₹${book.price} per book</p>
                                </div>
                            </div>
                            <div class="border-t pt-4">
                                <h4 class="font-semibold mb-2">Delivery Address:</h4>
                                <p class="text-gray-600">
                                    ${selectedAddress.street},<br/>
                                    ${selectedAddress.landmark},<br/>
                                    ${selectedAddress.city}, ${selectedAddress.state},<br/>
                                    ${selectedAddress.postalCode}
                                </p>
                            </div>
                            <div class="border-t border-b py-4 my-4">
                                <div class="flex items-center justify-between mb-4">
                                    <span>Quantity:</span>
                                    <div class="flex items-center gap-2">
                                        <button onclick="decrementQuantity()" class="px-3 py-1 bg-gray-200 rounded-lg">-</button>
                                        <span id="quantity-display">1</span>
                                        <button onclick="incrementQuantity(${book.copiesAvailable})" class="px-3 py-1 bg-gray-200 rounded-lg">+</button>
                                    </div>
                                </div>
                                <div class="flex justify-between font-bold">
                                    <span>Total Amount:</span>
                                    <span id="total-amount">₹${book.price}</span>
                                </div>
                            </div>
                            <div class="text-sm text-gray-500 mt-2">
                                ${book.copiesAvailable} copies available
                            </div>
                        </div>
                    `,
                    showCancelButton: true,
                    confirmButtonText: 'Place Order',
                    cancelButtonText: 'Cancel',
                    confirmButtonColor: '#10B981',
                    didOpen: () => {
                        // Add quantity control functions to window
                        window.incrementQuantity = (maxCopies) => {
                            if (quantity < maxCopies) {
                                quantity++;
                                document.getElementById('quantity-display').textContent = quantity;
                                document.getElementById('total-amount').textContent = `₹${(quantity * book.price).toFixed(2)}`;
                            }
                        };
                        window.decrementQuantity = () => {
                            if (quantity > 1) {
                                quantity--;
                                document.getElementById('quantity-display').textContent = quantity;
                                document.getElementById('total-amount').textContent = `₹${(quantity * book.price).toFixed(2)}`;
                            }
                        };
                    }
                });

                if (confirmOrder) {
                    // Validate quantity against available copies
                    if (quantity > book.copiesAvailable) {
                        toast.error('Selected quantity exceeds available copies');
                        return;
                    }

                    // Prepare purchase data according to your model
                    const purchaseData = {
                        userId: parseInt(userId),
                        bookTitle: book.title,
                        bookimageUrl: book.imageUrl,
                        author: book.authorName,
                        price: book.price,
                        quantity: quantity,
                        totalPrice: book.price * quantity,
                        purchasedDate: new Date(),
                        address: selectedAddress
                    };

                    // Make the purchase
                    const purchaseResponse = await axios.post(`${API_URL}/api/purchases`, purchaseData);

                    if (purchaseResponse.status === 201) {
                        toast.success('Order placed successfully!', {
                            position: "top-right",
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                        });

                        // Refresh books data
                        fetchBooks();
                    }
                }
            } else {
                // User clicked "Add New Address"
                navigate('/myorders');
            }

        } catch (error) {
            console.error('Error in purchase process:', error);
            toast.error('Failed to place order. Please try again.', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    const handleToggleFavorite = (book) => {
        const userId = localStorage.getItem('userId');

        if (!userId) {
            navigate('/login');
        } else {
            toggleFavorite(book);
            const favoriteIds = JSON.parse(localStorage.getItem('favorites')) || [];
            if (isFavorite(book._id)) {
                const updatedFavoriteIds = favoriteIds.filter(id => id !== book._id);
                localStorage.setItem('favorites', JSON.stringify(updatedFavoriteIds));
            } else {
                favoriteIds.push(book._id);
                localStorage.setItem('favorites', JSON.stringify(favoriteIds));
            }
        }
    };

    const indexOfLastBook = currentPage * itemsPerPage;
    const indexOfFirstBook = indexOfLastBook - itemsPerPage;
    const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
    const pageCount = Math.ceil(filteredBooks.length / itemsPerPage);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
        document.getElementById('books-section').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    };

    const imageUrls = [
        { url: lib1, text: 'Welcome to Books Adda, your one-stop shop for all genres!' },
        { url: lib2, text: 'Explore a vast collection of books at unbeatable prices!' },
        { url: lib3, text: 'Find your next great read at Books Adda!' },
        { url: lib4, text: 'Join our community of book lovers today!' }
    ];

    const handleSelectAddress = async (address) => {
        const userId = localStorage.getItem('userId');

        const purchaseData = {
            userId,
            bookTitle: selectedBook.title,
            bookimageUrl: selectedBook.imageUrl,
            author: selectedBook.authorName,
            price: selectedBook.price,
            quantity: copiesAvailable,
            shippingAddress: address,
        };

        try {
            const response = await axios.post(`${API_URL}/api/purchases`, purchaseData);
            if (response.status === 201) {
                Swal.fire('Success!', 'Book purchased successfully', 'success');
            } else {
                console.error('Failed to purchase book');
            }
        } catch (error) {
            console.error('Error purchasing book:', error);
            Swal.fire('Error!', 'Failed to complete purchase', 'error');
        } finally {
            setIsAddressModalOpen(false); // Close the modal
        }
    };

    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 1
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 1
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 1
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1
        }
    };

    const CustomDot = ({ onClick, ...rest }) => {
        const { active } = rest;
        return (
            <button
                className={`h-2 w-2 md:h-3 md:w-3 mx-1 rounded-full transition-all duration-300 ${active ? "bg-blue-600 w-6 md:w-8" : "bg-gray-400"}`}
                onClick={() => onClick()}
            />
        );
    };

    const theme = createTheme({
        palette: {
            primary: {
                main: '#3B82F6', // Tailwind blue-500
            },
        },
        components: {
            MuiPagination: {
                styleOverrides: {
                    root: {
                        '& .MuiPaginationItem-root': {
                            color: '#374151',
                            '&:hover': {
                                backgroundColor: '#F3F4F6',
                            },
                        },
                        '& .Mui-selected': {
                            backgroundColor: '#3B82F6 !important',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: '#2563EB !important',
                            },
                        },
                    },
                },
            },
        },
    });

    return (
        <>
            <Navbar />
            <div className="container-fluid mx-auto mt-24">
                <div className="px-4 md:px-8 mb-12">
                    <Carousel
                        responsive={responsive}
                        showDots={true}
                        autoPlay={true}
                        autoPlaySpeed={3000}
                        infinite={true}
                        arrows={true}
                        customDot={<CustomDot />}
                        containerClass="carousel-container overflow-hidden rounded-2xl shadow-2xl"
                        itemClass="carousel-item-padding-40-px"
                    >
                        {imageUrls.map((item, index) => (
                            <div key={index} className="relative h-[300px] md:h-[500px]">
                                <img 
                                    src={item.url} 
                                    alt={`Library ${index + 1}`} 
                                    className="w-full h-full object-cover brightness-75 transition-all duration-500 hover:brightness-100"
                                />
                                <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8 bg-gradient-to-t from-black/60 to-transparent">
                                    <motion.h2
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6 }}
                                        className="text-2xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg"
                                    >
                                        {item.text}
                                    </motion.h2>
                                </div>
                            </div>
                        ))}
                    </Carousel>
                </div>

                <div className="mt-6 px-8 pb-4" id="books-section">
                    <motion.div 
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Welcome to Our Book's Adda
                        </h1>
                        <p className="text-gray-600 text-lg md:text-xl mt-2">
                            <Typewriter 
                                words={['Discover your next great read...', 'Explore our collection...']} 
                                loop={false} 
                                cursor 
                                cursorStyle="_" 
                                typeSpeed={70} 
                                deleteSpeed={50} 
                                delaySpeed={1000} 
                            />
                        </p>
                    </motion.div>

                    <div className="mb-8 flex justify-center">
                        <div className="relative w-full md:w-2/3 lg:w-1/2">
                            <input 
                                type="text" 
                                className="w-full py-3 px-12 rounded-full border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 shadow-md" 
                                placeholder="Search by title, author, or genre..." 
                                value={searchTerm} 
                                onChange={handleSearch}
                            />
                            <BsSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4 sm:px-8">
                        {loading ? (
                            Array.from({ length: 8 }).map((_, index) => (
                                <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                                    <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300"></div>
                                    <div className="p-4">
                                        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-3/4 mb-3"></div>
                                        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-1/2 mb-3"></div>
                                        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-2/3"></div>
                                        <div className="mt-4 flex justify-between">
                                            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-24"></div>
                                            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-24"></div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            currentBooks.map((book) => (
                                <motion.div
                                    key={book._id}
                                    className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-500 ease-in-out hover:shadow-2xl relative group"
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -50 }}
                                    layout
                                >
                                    {/* Ribbon for bestseller or new arrival */}
                                    {book.copiesAvailable < 5 && (
                                        <div className="absolute top-4 -left-8 bg-red-500 text-white px-10 py-1 rotate-[-45deg] z-10 shadow-lg">
                                            Limited Stock
                                        </div>
                                    )}
                                    
                                    <div className="relative overflow-hidden group h-64">
                                        <img 
                                            src={book.imageUrl} 
                                            alt={book.title} 
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700 ease-in-out"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
                                            <p className="text-white text-sm line-clamp-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                                {book.summary}
                                            </p>
                                        </div>
                                        <button
                                            className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm p-2 rounded-full text-red-500 hover:bg-white/40 transition-all duration-300 transform hover:scale-110"
                                            onClick={() => handleToggleFavorite(book)}
                                        >
                                            {isFavorite(book._id) ? 
                                                <BsHeartFill size={20} className="filter drop-shadow-lg" /> : 
                                                <BsHeart size={20} className="filter drop-shadow-lg" />
                                            }
                                        </button>
                                    </div>

                                    <div className="p-6 bg-gradient-to-b from-white to-gray-50">
                                        <div className="space-y-3">
                                            <h2 className="text-xl font-bold text-gray-800 leading-tight line-clamp-2 hover:line-clamp-none transition-all duration-300">
                                                {book.title}
                                            </h2>
                                            <div className="flex items-center space-x-2">
                                                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                                    {book.genre}
                                                </span>
                                                <span className="text-gray-500 text-sm">by {book.authorName}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-2xl font-bold text-gray-900">₹{book.price}</span>
                                                    {book.originalPrice && (
                                                        <span className="text-sm text-gray-500 line-through">₹{book.originalPrice}</span>
                                                    )}
                                                </div>
                                                <span className="text-sm text-gray-600">
                                                    {book.copiesAvailable} left
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-6 flex gap-3">
                                            <button
                                                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition duration-300 transform hover:-translate-y-1 hover:shadow-lg flex items-center justify-center space-x-2"
                                                onClick={() => handleViewMore(book)}
                                            >
                                                <span>View More</span>
                                            </button>
                                            <button
                                                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2.5 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-600 transition duration-300 transform hover:-translate-y-1 hover:shadow-lg flex items-center justify-center space-x-2"
                                                onClick={() => handleBuy(book)}
                                            >
                                                <span>Buy Now</span>
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                    {!loading && pageCount > 1 && (
                        <ThemeProvider theme={theme}>
                            <Stack spacing={2} className="flex justify-center my-8">
                                <Pagination 
                                    count={pageCount}
                                    page={currentPage}
                                    onChange={handlePageChange}
                                    color="primary"
                                    size={paginationSize}
                                    showFirstButton 
                                    showLastButton
                                    siblingCount={window.innerWidth < 640 ? 0 : 1}
                                    boundaryCount={window.innerWidth < 640 ? 0 : 1}
                                />
                            </Stack>
                        </ThemeProvider>
                    )}
                </div>
                <Services />
                <Gallery />
                <Testimonials />
                <AddressModal
                    isOpen={isAddressModalOpen}
                    addresses={addresses}
                    onSelect={handleSelectAddress}
                    onRequestClose={() => setIsAddressModalOpen(false)}
                />
            </div>
        </>
    );
};

export default User;

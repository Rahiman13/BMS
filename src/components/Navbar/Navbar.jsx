import React, { useState, useContext, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { FavoritesContext } from '../pages/Favourite/FavoritesContext';
import links from '../NavLinks/links';
import FeedbackModal from './Feedbackmodal';
import Logo from '../Dasboard/logo';
import API_URL from '../../api';
import axios from 'axios';
import { toast } from 'react-toastify';

const NavBar = () => {
  const [open, setOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const { isLoggedIn, logout } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const { favorites } = useContext(FavoritesContext);
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  useEffect(() => {
    if (userId) {
      fetchUsername(userId);
    }
  }, [userId]);

  const fetchUsername = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      const response = await axios.get(`${API_URL}/api/users/${userId}`);
      if (response.status === 200) {
        setUsername(response.data.username);
      }
    } catch (error) {
      console.error('Error fetching username:', error);
    }
  };


  const handleLogoutConfirm = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Delay for 500ms
      localStorage.clear();
      sessionStorage.clear();
      // logout();
      setShowLogoutModal(false);
      navigate('/login'); 
      toast.success('Logged out successfully!');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out. Please try again.');
    }
  };

const handleLogoutCancel = () => {
  setShowLogoutModal(false);
};

const handleFeedbackClick = () => {
  setShowFeedbackModal(true);
};

return (
  <nav className="bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-blue-950 via-indigo-900 to-blue-900 fixed w-full z-[999] top-0 start-0 border-b border-gray-200 dark:border-gray-600">
    <div className="max-w-screen-xl flex flex-wrap py-3 items-center justify-between mx-auto px-3">
      <div className="">
        <Link to="/" className="flex items-center overflow-x-hidden space-x-3 rtl:space-x-reverse">
          {/* <img src={logo} className="h-24 w-22 overflow-x-hidden p-0" alt="Books Adda Logo" /> */}
          <Logo width="48px" height="48px" />
          <span className="self-center font-semibold font-cursive whitespace-nowrap dark:text-white text-base md:text-lg lg:text-3xl">
            Books Adda
          </span>
        </Link>
      </div>
      <div className="flex gap-5">
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <div className="flex flex-col">
            {userId ? (
              <button
                onClick={handleLogout}
                className="relative overflow-hidden px-6 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 focus:ring-2 focus:ring-blue-400"
              >
                Logout
              </button>
            ) : (
              <NavLink
                to="/login"
                className="relative overflow-hidden px-6 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 focus:ring-2 focus:ring-blue-400"
              >
                Login
              </NavLink>
            )}
          </div>
          <button
            data-collapse-toggle="navbar-sticky"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-sticky"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button>
        </div>
        <div className={`items-center justify-between ${open ? 'block' : 'hidden'} w-full md:flex md:w-auto md:order-1`} id="navbar-sticky">
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-transparent md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-transparent md:dark:bg-transparent dark:border-transparent">
            {links.map((link, index) => (
              <li key={index}>
                <NavLink
                  to={link.path}
                  className="block py-2 px-3 text-gray-900 rounded text-lg hover:bg-gray-700 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                  activeclassname="text-blue-700 dark:text-gray-500"

                >
                  {link.name}
                  {link.name === 'Favourites' && (
                    <span className="ml-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                      {favorites.length}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
            <li
              className="block py-2 px-3 text-gray-900 rounded text-lg hover:bg-gray-700 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700 cursor-pointer"
              onClick={handleFeedbackClick}
            >
              Feedback
            </li>
          </ul>
        </div>
      </div>
    </div>
    {showLogoutModal && (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <p className="text-lg font-semibold mb-4">Are you sure you want to logout <span className="font-bold text-2xl font-cursive">{username}</span>?</p>
          <div className="flex justify-end">
            <button
              onClick={handleLogoutConfirm}
              className="mr-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Yes
            </button>
            <button
              onClick={handleLogoutCancel}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              No
            </button>
          </div>
        </div>
      </div>
    )}
    <FeedbackModal isOpen={showFeedbackModal} onClose={() => setShowFeedbackModal(false)} />
  </nav>
);
};

export default NavBar;

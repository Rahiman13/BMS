import React, { useState, useContext, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { FavoritesContext } from '../pages/Favourite/FavoritesContext';
import links from '../NavLinks/links_admin';
import { FaBars } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../api';
import axios from 'axios';

const Navbar_admin = () => {
  const [open, setOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [username, setUsername] = useState('');
  const { isLoggedIn, logout } = useContext(AuthContext);
  const { favorites } = useContext(FavoritesContext);
  const userId = localStorage.getItem('userId');
  console.log(userId)


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

  
  useEffect(() => {
    if (isLoggedIn && userId) {
      fetchUsername(userId);
    }
  }, [isLoggedIn, userId]);

  
  // console.log('username', username);

  const handleLogout = () => {
    fetchUsername();
    setShowLogoutModal(true);
  };

  

  const handleLogoutConfirm = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Delay for 500ms
      localStorage.clear();
      sessionStorage.clear();
      logout();
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

  const toggleSidebar = () => {
    setOpen(!open);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <button onClick={toggleSidebar} className="lg:hidden p-4 fixed top-4 left-4 z-50 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all duration-300">
        <FaBars className="text-white" size={24} />
      </button>
      <nav className={`bg-gradient-to-b from-[#000080] to-[#000055] lg:w-72 px-6 flex flex-col items-start justify-between fixed h-full border-r border-white/10 z-40 w-full md:w-80 transform ${open ? 'translate-x-0' : '-translate-x-full'} transition-all duration-500 ease-in-out lg:translate-x-0 backdrop-blur-md`}>
        <div className="flex flex-col items-center w-full">
          <div className="p-6 w-full border-b border-white/10">
            {isLoggedIn && (
              <div className="text-white">
                <p className="text-sm uppercase tracking-wider opacity-70">Welcome back</p>
                <p className="text-2xl font-semibold mt-1">
                  <span className='font-cursive text-3xl bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent'>{username}</span>
                </p>
              </div>
            )}
          </div>
          <ul className="w-full mt-8 space-y-2">
            {links.map((link, index) => (
              <li key={index} className="w-full px-2">
                <NavLink
                  to={link.path}
                  className={({ isActive }) => 
                    `flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-white text-[#000080] shadow-lg shadow-white/10"
                        : "text-white hover:bg-white/10"
                    }`
                  }
                >
                  <span className="text-xl">{link.icon}</span>
                  <span className="ml-3 font-medium">{link.name}</span>
                  {link.name === 'Favourites' && favorites.length > 0 && (
                    <span className="ml-auto bg-red-500 text-white rounded-full px-2.5 py-0.5 text-xs font-bold">
                      {favorites.length}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-full p-6">
          {userId ? (
            <button
              onClick={handleLogout}
              className="w-full bg-white/10 text-white hover:bg-white hover:text-[#000080] transition-all duration-300 font-medium rounded-xl px-4 py-3 text-center backdrop-blur-sm border border-white/20 hover:border-white"
            >
              Logout
            </button>
          ) : (
            <NavLink
              to="/login"
              className="w-full bg-white/10 text-white hover:bg-white hover:text-[#000080] transition-all duration-300 font-medium rounded-xl px-4 py-3 text-center backdrop-blur-sm border border-white/20 hover:border-white"
            >
              Login
            </NavLink>
          )}
        </div>
      </nav>
      <div className="flex-1 lg:ml-72 pt-20 lg:pt-0">
        {/* Main content goes here */}
      </div>
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full mx-4 transform transition-all">
            <p className="text-xl text-gray-800 mb-6">
              Are you sure you want to logout, <span className="font-cursive text-2xl text-[#000080]">{username}</span>?</p>
            <div className="flex justify-end space-x-4">
              <NavLink to="/login">
                <button
                  onClick={handleLogoutConfirm}
                  className="px-6 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-300 font-medium"
                >
                  Logout
                </button>
              </NavLink>
              <button
                onClick={handleLogoutCancel}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-300 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar_admin;

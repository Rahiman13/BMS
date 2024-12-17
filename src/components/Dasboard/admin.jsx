import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import NavBar from '../Navbar/Navbar_admin';
import UserStats from './charts/user_charts';
import axios from 'axios';
import API_URL from '../../api';

const Admin = () => {
    const [loginData, setLoginData] = useState([]);
    const [editUser, setEditUser] = useState(null);
    const [editValues, setEditValues] = useState({});

    useEffect(() => {
        fetchLoginData();
    }, []);

    const fetchLoginData = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/users/login-times`);
            const data = await response.json();
            setLoginData(data);
        } catch (error) {
            console.error('Error fetching login data:', error);
        }
    };

    const groupByDate = (loginTimes) => {
        const grouped = {};
        loginTimes.forEach((loginTime) => {
            const date = new Date(loginTime.login).toDateString();
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(loginTime);
        });
        return grouped;
    };

    const handleEdit = (user) => {
        setEditUser(user._id);
        setEditValues({ username: user.username, email: user.email, mobile: user.mobile });
    };

    const handleSave = async (userId) => {
        try {
            await axios.put(`${API_URL}/api/users/${userId}`, editValues);
            setEditUser(null);
            fetchLoginData();
        } catch (error) {
            console.error('Error saving user data:', error);
        }
    };

    const handleDelete = async (userId) => {
        try {
            await axios.delete(`${API_URL}/api/users/${userId}`);
            fetchLoginData();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const confirmDelete = (userId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                handleDelete(userId);
                Swal.fire({
                    title: 'Deleted!',
                    text: 'User details have been deleted.',
                    icon: 'success'
                });
            }
        });
    };

    const calculateDuration = (loginTimes) => {
        return loginTimes.reduce((total, { login, logout }) => {
            if (login && logout) {
                const duration = new Date(logout) - new Date(login);
                return total + duration;
            }
            return total;
        }, 0);
    };

    const formatDuration = (milliseconds) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours}h ${minutes}m ${seconds}s`;
    };

    return (
        <>
            <div className="flex flex-col gap-0 lg:flex-row ">
                <NavBar className="w-full lg:w-1/4" />
                <div className="container  mx-auto p-2 w-full lg:w-3/4">
                    <h1 className="text-5xl pt-4 font-bold text-center font-cursive mb-4">Admin Dashboard</h1>
                    <div className="flex flex-col-2 lg:flex-row justify-center items-center">
                        <UserStats />
                    </div>
                    <table className="table-auto w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-300 px-4 py-2">Username</th>
                                <th className="border border-gray-300 px-4 py-2">Email</th>
                                <th className="border border-gray-300 px-4 py-2">Mobile</th>
                                <th className="border border-gray-300 px-4 py-2">Date</th>
                                <th className="border border-gray-300 px-4 py-2">Login Time(s)</th>
                                <th className="border border-gray-300 px-4 py-2">Logout Time(s)</th>
                                <th className="border border-gray-300 px-4 py-2">Duration</th>
                                <th className="border border-gray-300 px-4 py-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loginData.map((user, userIndex) => {
                                const sortedLoginTimes = [...user.loginTimes].sort((a, b) => new Date(b.login) - new Date(a.login));
                                const groupedLoginTimes = groupByDate(sortedLoginTimes);

                                return Object.entries(groupedLoginTimes).map(([date, times], index) => (
                                    <tr key={`${user._id}-${date}-${index}`} className={userIndex % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                                        {index === 0 && (
                                            <>
                                                <td className="border border-gray-300 px-4 py-2" rowSpan={Object.keys(groupedLoginTimes).length}>
                                                    {editUser === user._id ? (
                                                        <input
                                                            type="text"
                                                            value={editValues.username}
                                                            onChange={(e) => setEditValues({ ...editValues, username: e.target.value })}
                                                            className="w-full p-1 border rounded"
                                                        />
                                                    ) : (
                                                        user.username
                                                    )}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2" rowSpan={Object.keys(groupedLoginTimes).length}>
                                                    {editUser === user._id ? (
                                                        <input
                                                            type="email"
                                                            value={editValues.email}
                                                            onChange={(e) => setEditValues({ ...editValues, email: e.target.value })}
                                                            className="w-full p-1 border rounded"
                                                        />
                                                    ) : (
                                                        user.email
                                                    )}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2" rowSpan={Object.keys(groupedLoginTimes).length}>
                                                    {editUser === user._id ? (
                                                        <input
                                                            type="text"
                                                            value={editValues.mobile}
                                                            onChange={(e) => setEditValues({ ...editValues, mobile: e.target.value })}
                                                            className="w-full p-1 border rounded"
                                                        />
                                                    ) : (
                                                        user.mobile
                                                    )}
                                                </td>
                                            </>
                                        )}
                                        <td className="border border-gray-300 px-4 py-2">{date}</td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {times.map((time, index) => (
                                                <div key={index}>
                                                    {time.login ? new Date(time.login).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'N/A'}
                                                </div>
                                            ))}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {times.map((time, index) => (
                                                <div key={index}>
                                                    {time.logout ? new Date(time.logout).toLocaleTimeString() : 'N/A'}
                                                </div>
                                            ))}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {formatDuration(calculateDuration(times))}
                                        </td>
                                        {index === 0 && (
                                            <td className="border border-gray-300 px-4 py-2" rowSpan={Object.keys(groupedLoginTimes).length}>
                                                {editUser === user._id ? (
                                                    <>
                                                        <button
                                                            className="bg-blue-500 text-white px-2 py-1 m-1 rounded"
                                                            onClick={() => handleSave(user._id)}
                                                        >
                                                            <FontAwesomeIcon icon={faSave} className="mr-1" />

                                                        </button>
                                                        <button
                                                            className="bg-gray-500 text-white px-2 py-1 m-1 rounded"
                                                            onClick={() => setEditUser(null)}
                                                        >
                                                            <FontAwesomeIcon icon={faTimes} className="mr-1" />

                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            className="bg-yellow-500 text-white px-2 py-1 m-1 rounded"
                                                            onClick={() => handleEdit(user)}
                                                        >
                                                            <FontAwesomeIcon icon={faEdit} className="mr-1" />

                                                        </button>
                                                        <button
                                                            className="bg-red-500 text-white px-2 py-1 m-1 rounded"
                                                            onClick={() => confirmDelete(user._id)}
                                                        >
                                                            <FontAwesomeIcon icon={faTrash} className="mr-1" />

                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                ));
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default Admin;

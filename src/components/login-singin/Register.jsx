// Email authorization
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import emailjs from 'emailjs-com';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import loginimg from '../assets/login_img.png';
import Navbar from '../Navbar/Navbar';
import Modal from 'react-modal';
import API_URL from '../../api';

Modal.setAppElement('#root'); // Set this if you use a root element

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        role: 'user', // Default role
    });

    const [errors, setErrors] = useState({});
    const [otp, setOtp] = useState('');
    const [sentOtp, setSentOtp] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [buttonLabel, setButtonLabel] = useState('Send OTP');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Determine the role based on email
        if (name === 'email') {
            const role = value('rahimanshaik13@gmail.com') ? 'admin' : 'user';
            setFormData({ ...formData, [name]: value, role });
        }
    };

    const handleValidation = () => {
        let formIsValid = true;
        let errors = {};

        // Name validation
        if (!formData.name.trim()) {
            formIsValid = false;
            errors.name = 'Name cannot be empty';
        }

        // Mobile validation
        if (!formData.mobile) {
            formIsValid = false;
            errors.mobile = 'Mobile number cannot be empty';
        } else if (!/^\d{10}$/.test(formData.mobile)) {
            formIsValid = false;
            errors.mobile = 'Invalid mobile number - must be 10 digits';
        }

        // Email validation
        if (!formData.email) {
            formIsValid = false;
            errors.email = 'Email cannot be empty';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            formIsValid = false;
            errors.email = 'Invalid email address';
        }

        // Username validation
        if (!formData.username) {
            formIsValid = false;
            errors.username = 'Username cannot be empty';
        } else if (formData.username.length < 3) {
            formIsValid = false;
            errors.username = 'Username must be at least 3 characters long';
        }

        // Password validation
        if (!formData.password) {
            formIsValid = false;
            errors.password = 'Password cannot be empty';
        } else if (
            !/(?=.*[a-z])/.test(formData.password) || // lowercase
            !/(?=.*[A-Z])/.test(formData.password) || // uppercase
            !/(?=.*\d)/.test(formData.password) || // number
            !/(?=.*[@$!%*?&])/.test(formData.password) || // special char
            formData.password.length < 8
        ) {
            formIsValid = false;
            errors.password = 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character';
        }

        // Confirm Password validation
        if (formData.password !== formData.confirmPassword) {
            formIsValid = false;
            errors.confirmPassword = 'Passwords do not match';
        }

        setErrors(errors);
        return formIsValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (handleValidation()) {
            generateOtp();
        } else {
            toast.error('Form has errors');
        }
    };

    const generateOtp = () => {
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            setErrors({ ...errors, email: 'Please enter a valid email address.' });
            return;
        }

        const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
        setSentOtp(generatedOtp);

        emailjs
            .send(
                'service_dxwypsr',
                'template_9d1320w',
                {
                    to_email: formData.email,
                    otp: generatedOtp,
                },
                'azBe2gyRVGRab22cR'
            )
            .then((response) => {
                console.log('Email sent successfully:', response.status, response.text);
                toast.success('OTP sent to your email.');
                setButtonLabel('Resend OTP');
                setShowModal(true);
            })
            .catch((error) => {
                console.error('Failed to send email:', error);
                toast.error('Failed to send OTP. Please try again.');
            });
    };

    const verifyOtp = () => {
        if (otp === sentOtp) {
            toast.success('OTP verified successfully');
            setShowModal(false);
            registerUser();
        } else {
            toast.error('Invalid OTP. Please try again.');
        }
    };

    const registerUser = async () => {
        try {
            const registrationData = {
                name: formData.name,
                mobile: formData.mobile,
                email: formData.email,
                username: formData.username,
                password: formData.password,
                role: formData.role
            };

            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registrationData),
            });

            const data = await response.json();
            
            if (response.ok) {
                toast.success('Registration successful');
                navigate('/login');
            } else {
                const errorMessage = data.error || 'Registration failed';
                toast.error(errorMessage);
            }
        } catch (error) {
            console.error('Registration error:', error);
            toast.error('Error during registration. Please try again.');
        }
    };

    return (
        <>
            {/* <Navbar /> */}
            <section>
                <div className="h-full">
                    <div className="flex h-full flex-wrap items-center justify-center lg:justify-between">
                        <div className="shrink-1 mb-2 mt-12 grow-0 basis-auto md:mb-0 md:w-9/12 md:shrink-0 lg:w-6/12 xl:w-6/12">
                            <img src={loginimg} className="w-full" alt="Login Illustration" />
                        </div>

                        <div className="mb-12 md:mb-0 md:w-8/12 lg:w-5/12 xl:w-5/12 pr-12">
                            <form onSubmit={handleSubmit}>
                                <div className="flex flex-row mt-16 items-center justify-center sm:justify-center lg:justify-start">
                                    <p className="mb-0 me-4 text-lg font-bold">Sign up with</p>

                                    <button type="button" className="mx-1 inline-block h-9 w-9 rounded-full bg-primary fill-black p-2 uppercase leading-normal shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong">
                                        <span className="[&>svg]:mx-auto [&>svg]:h-3.5 [&>svg]:w-3.5">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                                <path d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z" />
                                            </svg>
                                        </span>
                                    </button>

                                    <button type="button" className="mx-1 inline-block h-9 w-9 rounded-full bg-primary fill-black p-2 uppercase leading-normal shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong">
                                        <span className="[&>svg]:mx-auto [&>svg]:h-3.5 [&>svg]:w-3.5">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                                <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
                                            </svg>
                                        </span>
                                    </button>

                                    <button type="button" className="mx-1 inline-block h-9 w-9 rounded-full bg-primary fill-black p-2 uppercase leading-normal shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong">
                                        <span className="[&>svg]:mx-auto [&>svg]:h-3.5 [&>svg]:w-3.5">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                                <path d="M100.3 448H7.4V148.9h92.9zM53.8 108.1C24.1 108.1 0 83.5 0 53.8a53.8 53.8 0 0 1 107.6 0c0 29.7-24.1 54.3-53.8 54.3zM447.9 448h-92.7V302.4c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.7V448h-92.8V148.9h89.1v40.8h1.3c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3V448z" />
                                            </svg>
                                        </span>
                                    </button>
                                </div>

                                <div className="my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300 dark:before:border-neutral-500 dark:after:border-neutral-500">
                                    <p className="mx-4 mb-0 text-center font-semibold dark:text-black">Or</p>
                                </div>

                                <div className="relative mb-6" >
                                    <input type="text" name="name" value={formData.name} onChange={handleChange}
                                        // className="peer block min-h-[auto] w-full rounded border-0 bg-gray-200 px-3 py-[0.32rem] leading-[2.15] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 dark:text-black peer-focus:text-black motion-reduce:transition-none dark:placeholder:text-gray-500" 
                                        className="peer block min-h-[auto] w-full rounded border-0 bg-gray-200 px-3 py-[0.32rem] leading-[2.15] outline-none dark:text-black"

                                        placeholder="Full Name" />
                                    {errors.name && <span className="text-red-500">{errors.name}</span>}
                                </div>

                                <div className="relative mb-6">
                                    <input type="text" name="mobile" value={formData.mobile} onChange={handleChange}
                                        // className="peer block min-h-[auto] w-full rounded border-0 bg-gray-200 px-3 py-[0.32rem] leading-[2.15] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 dark:text-neutral-200 peer-focus:text-primary motion-reduce:transition-none dark:placeholder:text-neutral-200" placeholder="Mobile Number" />
                                        // className="peer block min-h-[auto] w-full rounded border-0 bg-gray-200 px-3 py-[0.32rem] leading-[2.15] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 dark:text-black peer-focus:text-black motion-reduce:transition-none dark:placeholder:text-gray-500"
                                        className="peer block min-h-[auto] w-full rounded border-0 bg-gray-200 px-3 py-[0.32rem] leading-[2.15] outline-none dark:text-black"

                                        placeholder="Mobile" />

                                    {errors.mobile && <span className="text-red-500">{errors.mobile}</span>}
                                </div>

                                <div className="relative mb-6">
                                    <input type="email" name="email" value={formData.email} onChange={handleChange}
                                        // className="peer block min-h-[auto] w-full rounded border-0 bg-gray-200 px-3 py-[0.32rem] leading-[2.15] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 dark:text-neutral-200 peer-focus:text-primary motion-reduce:transition-none dark:placeholder:text-neutral-200" placeholder="Email address" />
                                        // className="peer block min-h-[auto] w-full rounded border-0 bg-gray-200 px-3 py-[0.32rem] leading-[2.15] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 dark:text-black peer-focus:text-black motion-reduce:transition-none dark:placeholder:text-gray-500"
                                        className="peer block min-h-[auto] w-full rounded border-0 bg-gray-200 px-3 py-[0.32rem] leading-[2.15] outline-none dark:text-black"

                                        placeholder="Enter Your Email" />

                                    {errors.email && <span className="text-red-500">{errors.email}</span>}
                                </div>

                                <div className="relative mb-6">
                                    <input type="text" name="username" value={formData.username} onChange={handleChange}
                                        // className="peer block min-h-[auto] w-full rounded border-0 bg-gray-200 px-3 py-[0.32rem] leading-[2.15] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 dark:text-neutral-200 peer-focus:text-primary motion-reduce:transition-none dark:placeholder:text-neutral-200" 
                                        className="peer block min-h-[auto] w-full rounded border-0 bg-gray-200 px-3 py-[0.32rem] leading-[2.15] outline-none dark:text-black"

                                        placeholder="Username" />
                                    {errors.username && <span className="text-red-500">{errors.username}</span>}
                                </div>

                                <div className="relative mb-6">
                                    <input type="password" name="password" value={formData.password} onChange={handleChange}
                                        // className="peer block min-h-[auto] w-full rounded border-0 bg-gray-200 px-3 py-[0.32rem] leading-[2.15] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 dark:text-neutral-200 peer-focus:text-primary motion-reduce:transition-none dark:placeholder:text-neutral-200" 
                                        className="peer block min-h-[auto] w-full rounded border-0 bg-gray-200 px-3 py-[0.32rem] leading-[2.15] outline-none dark:text-black"

                                        placeholder="Password" />
                                    {errors.password && <span className="text-red-500">{errors.password}</span>}
                                </div>

                                <div className="relative mb-6">
                                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                                        // className="peer block min-h-[auto] w-full rounded border-0 bg-gray-200 px-3 py-[0.32rem] leading-[2.15] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 dark:text-neutral-200 peer-focus:text-primary motion-reduce:transition-none dark:placeholder:text-neutral-200" 
                                        className="peer block min-h-[auto] w-full rounded border-0 bg-gray-200 px-3 py-[0.32rem] leading-[2.15] outline-none dark:text-black"

                                        placeholder="Confirm Password" />
                                    {errors.confirmPassword && <span className="text-red-500">{errors.confirmPassword}</span>}
                                </div>

                                <button type="submit"
                                    className="inline-block w-full rounded bg-blue-700 px-7 py-3 text-md font-medium uppercase leading-normal text-white shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2">Register</button>
                                <ToastContainer />
                            </form>

                            <div className="flex items-center mt-2 justify-between">
                                <p className="mb-0 text-sm font-semibold dark:text-black">
                                    Already have an account?{' '}
                                    <Link to="/login" className="text-red-700 text-lg pl-1 hover:underline hover:text-primary-accent-300 focus:text-primary-accent-300 active:text-primary-600">
                                        Login
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Modal
                isOpen={showModal}
                onRequestClose={() => setShowModal(false)}
                className="flex justify-center items-center h-screen"
            >
                <div className="bg-white rounded-lg p-6 shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4">OTP Verification</h2>
                    <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md"
                        placeholder="Enter OTP"
                    />
                    <div className="flex justify-end mt-4 gap-3">

                        <button
                            onClick={verifyOtp}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Verify OTP
                        </button>
                        <button
                            onClick={generateOtp}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Resend OTP
                        </button>
                        <button
                            onClick={() => setShowModal(false)}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default Register;

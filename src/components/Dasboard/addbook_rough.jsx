import React, { useState } from 'react';
import Swal from 'sweetalert2';
import AddBooks_bg from '../assets/AddBooks_bg.jpg';
import './AddBooks.css';
import Navbar from '../Navbar/Navbar_admin';
import axios from 'axios';
import API_URL from '../../api';

const AddBooks = () => {
    const [formData, setFormData] = useState({
        title: '',
        authorName: '',
        bio: '', // Updated to capture author bio
        genre: '',
        publisherName: '',
        totalCopies: 0,
        coverImage: '',
        publishedDate: '',
        price: 0,
        summary: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const validateFormData = () => {
        for (const key in formData) {
            if (formData[key] === '' || formData[key] === null || (typeof formData[key] === 'number' && formData[key] <= 0)) {
                Swal.fire('Error', `${key.charAt(0).toUpperCase() + key.slice(1)} is required and must be valid`, 'error');
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateFormData()) return;

        const data = {
            title: formData.title,
            summary: formData.summary,
            imageUrl: formData.coverImage,
            price: formData.price,
            totalCopies: formData.totalCopies,
            copiesAvailable: formData.totalCopies,
            publishedDate: formData.publishedDate,
            publisherName: formData.publisherName,
            authorName: formData.authorName,
            genre: formData.genre,
            bio: formData.bio, // Included author bio
        };

        try {
            // Ensure publisher and author exist, and add book
            const response = await fetch(`$API_URL}/api/books`, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                Swal.fire('Success', 'Book added successfully', 'success');
                setFormData({
                    title: '',
                    authorName: '',
                    bio: '', // Reset the author bio
                    genre: '',
                    publisherName: '',
                    totalCopies: 0,
                    coverImage: '',
                    publishedDate: '',
                    price: 0,
                    summary: '',
                });
            } else {
                const errorData = await response.json();
                Swal.fire('Error', errorData.error || 'Failed to add book', 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'Failed to add book: ' + error.message, 'error');
        }
    };

    return (
        <>
            <Navbar />
            <div className="container-fluid mx-auto mt-24 pt-4 bg-cover bg-center h-full" style={{ backgroundImage: `url(${AddBooks_bg})` }}>
                <div className="bg-black w-[600px] mx-auto bg-opacity-60 p-8 rounded-lg">
                    <h1 className="text-3xl font-bold text-white text-center mb-4">Add a New Book</h1>
                    <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
                        <div className="mb-4">
                            <label className="block text-white text-sm font-bold mb-2" htmlFor="title">Book Name</label>
                            <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline" required />
                        </div>
                        <div className="mb-4">
                            <label className="block text-white text-sm font-bold mb-2" htmlFor="authorName">Author Name</label>
                            <input type="text" id="authorName" name="authorName" value={formData.authorName} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline" required />
                        </div>
                        <div className="mb-4">
                            <label className="block text-white text-sm font-bold mb-2" htmlFor="bio">Author Bio</label>
                            <input type="text" id="bio" name="bio" value={formData.bio} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline" required />
                        </div>
                        <div className="mb-4">
                            <label className="block text-white text-sm font-bold mb-2" htmlFor="genre">Genre</label>
                            <input type="text" id="genre" name="genre" value={formData.genre} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline" required />
                        </div>
                        <div className="mb-4">
                            <label className="block text-white text-sm font-bold mb-2" htmlFor="publisherName">Publisher Name</label>
                            <input type="text" id="publisherName" name="publisherName" value={formData.publisherName} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline" required />
                        </div>
                        <div className="mb-4">
                            <label className="block text-white text-sm font-bold mb-2" htmlFor="totalCopies">Total Copies</label>
                            <input type="number" id="totalCopies" name="totalCopies" value={formData.totalCopies} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline" required />
                        </div>
                        <div className="mb-4">
                            <label className="block text-white text-sm font-bold mb-2" htmlFor="coverImage">Cover Image (Image Link)</label>
                            <input type="text" id="coverImage" name="coverImage" value={formData.coverImage} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline" required />
                        </div>
                        <div className="mb-4">
                            <label className="block text-white text-sm font-bold mb-2" htmlFor="publishedDate">Published Date</label>
                            <input type="date" id="publishedDate" name="publishedDate" value={formData.publishedDate} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline" required />
                        </div>
                        <div className="mb-4">
                            <label className="block text-white text-sm font-bold mb-2" htmlFor="price">Price</label>
                            <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline" required />
                        </div>
                        <div className="mb-4">
                            <label className="block text-white text-sm font-bold mb-2" htmlFor="summary">Summary</label>
                            <textarea id="summary" name="summary" value={formData.summary} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline" required />
                        </div>
                        <div className="flex items-center justify-between">
                            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Add Book</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default AddBooks;







// import React, { useState } from 'react';
// import Swal from 'sweetalert2';
// import AddBooks_bg from '../assets/AddBooks_bg.jpg';
// import './AddBooks.css';
// import Navbar from '../Navbar/Navbar_admin';

// const AddBooks = () => {
//     const [formData, setFormData] = useState({
//         title: '',
//         authorName: '',
//         bio: '', // Updated to capture author bio
//         genre: '',
//         publisherName: '',
//         totalCopies: 0,
//         coverImage: '',
//         publishedDate: '',
//         price: 0,
//         summary: '',
//     });

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prevState) => ({
//             ...prevState,
//             [name]: value,
//         }));
//     };

//     const validateFormData = () => {
//         for (const key in formData) {
//             if (formData[key] === '' || formData[key] === null || (typeof formData[key] === 'number' && formData[key] <= 0)) {
//                 Swal.fire('Error', `${key.charAt(0).toUpperCase() + key.slice(1)} is required and must be valid`, 'error');
//                 return false;
//             }
//         }
//         return true;
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!validateFormData()) return;

//         const data = {
//             title: formData.title,
//             summary: formData.summary,
//             imageUrl: formData.coverImage,
//             price: formData.price,
//             totalCopies: formData.totalCopies,
//             copiesAvailable: formData.totalCopies,
//             publishedDate: formData.publishedDate,
//             publisherName: formData.publisherName,
//             authorName: formData.authorName,
//             genre: formData.genre,
//             bio: formData.bio, // Included author bio
//         };

//         try {
//             // Ensure publisher and author exist, and add book
//             const response = await fetch(`https://books-adda-backend.onrender.com/books`, {
//                 method: 'POST',
//                 body: JSON.stringify(data),
//                 headers: {
//                     'Content-Type': 'application/json'
//                 }
//             });

//             if (response.ok) {
//                 Swal.fire('Success', 'Book added successfully', 'success');
//                 setFormData({
//                     title: '',
//                     authorName: '',
//                     bio: '', // Reset the author bio
//                     genre: '',
//                     publisherName: '',
//                     totalCopies: 0,
//                     coverImage: '',
//                     publishedDate: '',
//                     price: 0,
//                     summary: '',
//                 });
//             } else {
//                 const errorData = await response.json();
//                 Swal.fire('Error', errorData.error || 'Failed to add book', 'error');
//             }
//         } catch (error) {
//             Swal.fire('Error', 'Failed to add book: ' + error.message, 'error');
//         }
//     };

//     return (
//         <>
//             <Navbar />
//             <div className="container-fluid mx-auto mt-24 pt-4 bg-cover bg-center h-full" style={{ backgroundImage: `url(${AddBooks_bg})` }}>
//                 <div className="bg-black w-[600px] mx-auto bg-opacity-60 p-8 rounded-lg">
//                     <h1 className="text-3xl font-bold text-white text-center mb-4">Add a New Book</h1>
//                     <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
//                         <div className="mb-4">
//                             <label className="block text-white text-sm font-bold mb-2" htmlFor="title">Book Name</label>
//                             <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline" required />
//                         </div>
//                         <div className="mb-4">
//                             <label className="block text-white text-sm font-bold mb-2" htmlFor="authorName">Author Name</label>
//                             <input type="text" id="authorName" name="authorName" value={formData.authorName} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline" required />
//                         </div>
//                         <div className="mb-4">
//                             <label className="block text-white text-sm font-bold mb-2" htmlFor="bio">Author Bio</label>
//                             <input type="text" id="bio" name="bio" value={formData.bio} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline" required />
//                         </div>
//                         <div className="mb-4">
//                             <label className="block text-white text-sm font-bold mb-2" htmlFor="genre">Genre</label>
//                             <input type="text" id="genre" name="genre" value={formData.genre} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline" required />
//                         </div>
//                         <div className="mb-4">
//                             <label className="block text-white text-sm font-bold mb-2" htmlFor="publisherName">Publisher Name</label>
//                             <input type="text" id="publisherName" name="publisherName" value={formData.publisherName} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline" required />
//                         </div>
//                         <div className="mb-4">
//                             <label className="block text-white text-sm font-bold mb-2" htmlFor="totalCopies">Total Copies</label>
//                             <input type="number" id="totalCopies" name="totalCopies" value={formData.totalCopies} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline" required />
//                         </div>
//                         <div className="mb-4">
//                             <label className="block text-white text-sm font-bold mb-2" htmlFor="coverImage">Cover Image (Image Link)</label>
//                             <input type="text" id="coverImage" name="coverImage" value={formData.coverImage} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline" required />
//                         </div>
//                         <div className="mb-4">
//                             <label className="block text-white text-sm font-bold mb-2" htmlFor="publishedDate">Published Date</label>
//                             <input type="date" id="publishedDate" name="publishedDate" value={formData.publishedDate} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline" required />
//                         </div>
//                         <div className="mb-4">
//                             <label className="block text-white text-sm font-bold mb-2" htmlFor="price">Price</label>
//                             <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline" required />
//                         </div>
//                         <div className="mb-4">
//                             <label className="block text-white text-sm font-bold mb-2" htmlFor="summary">Summary</label>
//                             <textarea id="summary" name="summary" value={formData.summary} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline" required />
//                         </div>
//                         <div className="flex items-center justify-between">
//                             <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Add Book</button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default AddBooks;


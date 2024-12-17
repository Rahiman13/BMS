import React, { useState } from 'react';
import Modal from 'react-modal';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import API_URL from '../../api';

const EditBookModal = ({ book, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({ ...book });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            if (!book.id) {
                toast.error('Book ID is missing');
                return;
            }

            // Show loading state
            Swal.fire({
                title: 'Updating Book...',
                text: 'Please wait',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const response = await fetch(`${API_URL}/api/books/${book.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            // Close loading state
            Swal.close();

            if (response.ok) {
                const updatedBook = await response.json();
                onUpdate(updatedBook);
                onClose();
                
                // Show success message
                // Swal.fire({
                //     icon: 'success',
                //     title: 'Success!',
                //     text: 'Book updated successfully',
                //     timer: 2000,
                //     showConfirmButton: false
                // });

                toast.success('Book updated successfully!');
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update book');
            }
        } catch (error) {
            console.error('Error updating book:', error);
            
            // Show error message
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: error.message || 'Failed to update book',
                confirmButtonText: 'OK'
            });

            toast.error('Failed to update book');
        }
    };

    const handleCancel = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You will lose any unsaved changes!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, discard changes',
            cancelButtonText: 'No, keep editing'
        }).then((result) => {
            if (result.isConfirmed) {
                onClose();
                toast.info('Changes discarded');
            }
        });
    };

    return (
        <Modal 
            isOpen 
            onRequestClose={handleCancel} 
            className="modal" 
            overlayClassName="modal-overlay"
            style={{
                content: {
                    maxHeight: '90vh',  // 90% of viewport height
                    margin: 'auto',
                }
            }}
        >
            <div className="bg-white w-full max-w-md mx-auto rounded-lg p-6" style={{ maxHeight: '100%' }}>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Edit Book</h2>
                <form onSubmit={handleSubmit} className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 120px)' }}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Book Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Author Name</label>
                        <input
                            type="text"
                            name="authorName"
                            value={formData.authorName}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Publisher Name</label>
                        <input
                            type="text"
                            name="publisherName"
                            value={formData.publisherName}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Genre</label>
                        <input
                            type="text"
                            name="genre"
                            value={formData.genre}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Price</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Total Copies</label>
                        <input
                            type="number"
                            name="totalCopies"
                            value={formData.totalCopies}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Copies Available</label>
                        <input
                            type="number"
                            name="copiesAvailable"
                            value={formData.copiesAvailable}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Image URL</label>
                        <input
                            type="text"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Author Bio</label>
                        <textarea
                            name="authorBio"
                            value={formData.authorBio}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                            rows="3"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Summary</label>
                        <textarea
                            name="summary"
                            value={formData.summary}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                            rows="3"
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default EditBookModal;

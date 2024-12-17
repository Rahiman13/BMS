// AddressModal.js
import React from 'react';
import Modal from 'react-modal';
import { FaTimes } from 'react-icons/fa';

const AddressModal = ({ isOpen, addresses, onSelect, onRequestClose }) => {
    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="modal-content" overlayClassName="modal-overlay">
            <div className="bg-white rounded-lg p-4 w-11/12 md:w-1/2 mx-auto mt-20">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold mb-4">Select Address</h2>
                    <button onClick={onRequestClose} className="text-gray-500 hover:text-gray-700">
                        <FaTimes size={24} />
                    </button>
                </div>
                {addresses.length === 0 ? (
                    <p className="text-gray-600">No addresses available.</p>
                ) : (
                    <ul>
                        {addresses.map((address) => (
                            <li key={address.id || `address-${address.street}`} className="address-item">
                                <p>{address.street}, {address.landmark}, {address.city}, {address.state}, {address.postalCode}, {address.country}</p>
                            </li>
                        ))}
                    </ul>
                )}
                <div className="flex justify-end mt-4">
                    <button onClick={onRequestClose} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700">Close</button>
                </div>
            </div>
        </Modal>
    );
};

export default AddressModal;

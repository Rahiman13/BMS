import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../../api';

const EnquiryComponent = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [message, setMessage] = useState('');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    // Fetch enquiries on component mount
    const fetchEnquiries = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/${userId}/enquiry`);
        setEnquiries(response.data);
      } catch (err) {
        console.error('Error fetching enquiries:', err);
      }
    };

    fetchEnquiries();
  }, [userId]);

  const handleAddEnquiry = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/${userId}/enquiry`, { message });
      setEnquiries(response.data.enquiries);
      setMessage('');
    } catch (err) {
      console.error('Error adding enquiry:', err);
    }
  };

  return (
    <div>
      <h2>Your Enquiries</h2>
      <ul>
        {enquiries.map((enquiry, index) => (
          <li key={index}>{enquiry.message} - {new Date(enquiry.date).toLocaleString()}</li>
        ))}
      </ul>
      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your enquiry"
        />
        <button onClick={handleAddEnquiry}>Submit Enquiry</button>
      </div>
    </div>
  );
};

export default EnquiryComponent;

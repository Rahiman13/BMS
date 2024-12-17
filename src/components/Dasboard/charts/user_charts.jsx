import React, { useEffect, useState } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import axios from 'axios';
import { Chart, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import API_URL from '../../../api';

// Register the components
Chart.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const UserStats = () => {
  const [activeUsers, setActiveUsers] = useState(0);
  const [frequentUsers, setFrequentUsers] = useState(0);
  const [inactiveUsers, setInactiveUsers] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const activeResponse = await axios.get(`${API_URL}/users/active`);
        const frequentResponse = await axios.get(`${API_URL}/users/frequent`);
        const inactiveResponse = await axios.get(`${API_URL}/users/inactive`);

        setActiveUsers(activeResponse.data.length);
        setFrequentUsers(frequentResponse.data.length);
        setInactiveUsers(inactiveResponse.data.length);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const doughnutData = {
    labels: ['Active Users', 'Frequent Users', 'Inactive Users'],
    datasets: [
      {
        label: 'User Statistics',
        data: [activeUsers, frequentUsers, inactiveUsers],
        backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'],
      },
    ],
  };

  const barData = {
    labels: ['Active Users', 'Frequent Users', 'Inactive Users'],
    datasets: [
      {
        label: 'User Count',
        data: [activeUsers, frequentUsers, inactiveUsers],
        backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'],
      },
    ],
  };

  return (
    <div style={{ width: '100%', maxWidth: '100%', margin: '0 auto' }} className='flex flex-col-2 gap-8'>
      <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
        <Doughnut data={doughnutData} />
        <h2 className='text-center mt-3 text-lg font-semibold'>User Statistics</h2>
      </div>
      <div style={{ width: '100%', marginTop: '50px' }}>
        <Bar data={barData} />
        <h2 className='text-center mt-3 text-lg font-semibold'>User Counts</h2>
      </div>
    </div>
  );
};

export default UserStats;

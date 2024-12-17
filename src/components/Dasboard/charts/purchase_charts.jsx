import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Doughnut, Bar } from 'react-chartjs-2';
import API_URL from '../../../api';

const BooksChartComponent = () => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        fetchDataFromBackend();
    }, []);

    const fetchDataFromBackend = async () => {
        try {
            // Replace with your actual backend API endpoint
            const response = await axios.get(`${API_URL}/users/purchase`);
            const usersData = response.data;

            // Process data for charts
            const labels = [];
            const quantities = [];
            const colors = [];

            usersData.forEach(user => {
                user.purchases.forEach(purchase => {
                    labels.push(`${user.username} - ${purchase.author}`);
                    quantities.push(purchase.quantity);
                    colors.push(generateRandomColor());
                });
            });

            const chartData = {
                labels: labels,
                datasets: [
                    {
                        label: 'Quantity of Purchased Books',
                        data: quantities,
                        backgroundColor: colors,
                    },
                ],
            };

            setChartData(chartData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const generateRandomColor = () => {
        const color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.6)`;
        return color;
    };

    const options = {
        tooltips: {
            callbacks: {
                label: function (tooltipItem, data) {
                    const dataset = data.datasets[tooltipItem.datasetIndex];
                    const currentValue = dataset.data[tooltipItem.index];
                    return `${data.labels[tooltipItem.index]}: ${currentValue}`;
                },
            },
        },
    };

    return (
        <div style={{ width: '100%', maxWidth: '100%', margin: '0' }} className="flex flex-cols-2 gap-8">
            {chartData && (
                <>
                    <div style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}>
                        <Doughnut data={chartData} options={options} />
                        <h2 className="text-lg font-semibold mb-2 text-center">Doughnut Chart (Purchased Books)</h2>
                    </div>
                    <div style={{ width: '100%', marginTop: '160px' }}>
                        <Bar data={chartData} options={options} />
                        <h2 className="text-lg font-semibold mb-2 text-center">Bar Chart (Purchased Books)</h2>
                    </div>
                </>
            )}
        </div>
    );
};

export default BooksChartComponent;

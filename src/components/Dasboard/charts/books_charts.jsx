// src/components/ChartsComponent.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Doughnut, Bar } from 'react-chartjs-2';
import API_URL from '../../../api';

const ChartsComponent = () => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        fetchDataFromBackend();
    }, []);

    const fetchDataFromBackend = async () => {
        try {
            const response = await axios.get(`${API_URL}/books`); // Assuming your backend is running on the same host/port
            const booksData = response.data;

            // Process data for charts
            const authors = {};
            booksData.forEach(book => {
                const authorName = book.author;
                if (!authors[authorName]) {
                    authors[authorName] = {
                        author: authorName,
                        numBooks: 0,
                    };
                }
                authors[authorName].numBooks += 1;
            });

            const authorLabels = Object.keys(authors);
            const numBooksData = Object.values(authors).map(author => author.numBooks);
            const backgroundColors = getRandomColors(authorLabels.length);

            const chartData = {
                labels: authorLabels,
                datasets: [
                    {
                        label: 'Number of Books',
                        data: numBooksData,
                        backgroundColor: backgroundColors,
                    },
                ],
            };

            setChartData(chartData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const getRandomColors = (numColors) => {
        // Generate random colors for each dataset
        const colors = [];
        for (let i = 0; i < numColors; i++) {
            const color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8)`;
            colors.push(color);
        }
        return colors;
    };

    const options = {
        tooltips: {
            callbacks: {
                label: function (tooltipItem, data) {
                    return `${data.labels[tooltipItem.index]}: ${tooltipItem.yLabel} books`;
                },
            },
        },
    };

    return (
        <div style={{ width: '100%', maxWidth: '100%', margin: '0' }} className='flex flex-col-2 gap-6 mb-28'>
            {/* <div className="flex flex-cols-2 gap-8"> */}
                {chartData && (
                    <>
                        <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
                            <Doughnut data={chartData} options={options} />
                            <h2 className="text-lg font-semibold mb-2 text-center">Doughnut Chart (Number of Books per Author)</h2>
                        </div>
                        <div style={{ width: '100%', marginTop: '40px' }}>
                            <Bar data={chartData} options={options} />
                            <h2 className="text-lg font-semibold mb-2 text-center">Bar Chart (Number of Books per Author)</h2>
                        </div>
                    </>
                )}
            {/* </div> */}
        </div>
    );
};

export default ChartsComponent;

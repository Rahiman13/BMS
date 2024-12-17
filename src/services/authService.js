import axios from 'axios';
import API_URL from '../api';

const login = (formData) => {
    return axios.post(`${API_URL}/api/auth/login`, formData);
};

const register = (formData) => {
    return axios.post(`${API_URL}/api/auth/register`, formData);
};

export default {
    login,
    register
};

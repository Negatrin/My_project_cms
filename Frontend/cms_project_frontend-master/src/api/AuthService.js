import axios from 'axios';

const API_URL = 'http://localhost:8082/users';  // Update this to your actual backend API URL

export const loginUser = async (userData) => {
  return await axios.post(`${API_URL}/login`, userData);
};

export const registerUser = async (userData) => {
  return await axios.post(`${API_URL}/register`, userData);
};

export const getUser = async (userName, token) => {
  return await axios.get(`${API_URL}/${userName}`, { headers: { Authorization: `Bearer ${token}` } });
}

export const ResetPassword = async(userId, password, token)=>{
  return await axios.put(`${API_URL}/${userId}/reset-password`,{password}, { headers: { Authorization: `Bearer ${token}` } }); 
}

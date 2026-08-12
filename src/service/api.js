// src/service/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// ===== AUTH API =====
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login/`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Login failed');
  }
};

// ===== SPECIAL DAYS API =====
export const createSpecialDay = async (formData) => {
  try {
    const token = localStorage.getItem('accessToken');
    
    const response = await axios.post(
      `${API_URL}/create-special-day/`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(error.response?.data?.message || error.response?.data?.error || 'Failed to create special day');
  }
};


// ===== SENTENCE OF THE DAY API =====
export const createSentenceOfDay = async (formData) => {
  try {
    const token = localStorage.getItem('accessToken');
    
    const response = await axios.post(
      `${API_URL}/create-sentence-of-day/`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(error.response?.data?.message || error.response?.data?.error || 'Failed to create sentence of day');
  }
};

// Get top students
export const getTopStudents = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    
    const response = await axios.get(
      `${API_URL}/top-students/`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(error.response?.data?.message || error.response?.data?.error || 'Failed to fetch top students');
  }
};
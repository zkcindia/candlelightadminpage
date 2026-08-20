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

// ===== STUDENTS API =====

// GET all students
export const getAdminStudents = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    
    const response = await axios.get(
      `${API_URL}/admin-students/`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(error.response?.data?.message || error.response?.data?.error || 'Failed to fetch students');
  }
};

// PUT - Update student by ID
export const updateStudent = async (studentId, formData) => {
  try {
    const token = localStorage.getItem('accessToken');
    
    const response = await axios.put(
      `${API_URL}/admin-students/${studentId}/`,
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
    throw new Error(error.response?.data?.message || error.response?.data?.error || 'Failed to update student');
  }
};

// DELETE - Delete student by ID
export const deleteStudent = async (studentId) => {
  try {
    const token = localStorage.getItem('accessToken');
    
    const response = await axios.delete(
      `${API_URL}/admin-students/${studentId}/delete/`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(error.response?.data?.message || error.response?.data?.error || 'Failed to delete student');
  }
};



// ===== TEACHER APPROVALS API =====

// GET all teachers
export const getAdminTeachers = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    
    const response = await axios.get(
      `${API_URL}/admin-teachers/`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    
    // Return the data array from the response
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(error.response?.data?.message || error.response?.data?.error || 'Failed to fetch teachers');
  }
};


export const updateTeacher = async (teacherId, formData) => {
  try {
    const token = localStorage.getItem('accessToken');
    
    const response = await axios.put(
      `${API_URL}/admin-teacher/${teacherId}/edit/`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(error.response?.data?.message || error.response?.data?.error || 'Failed to update teacher');
  }
};

// DELETE teacher by ID
export const deleteTeacher = async (teacherId) => {
  try {
    const token = localStorage.getItem('accessToken');
    
    const response = await axios.delete(
      `${API_URL}/admin-teacher/${teacherId}/delete/`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(error.response?.data?.message || error.response?.data?.error || 'Failed to delete teacher');
  }
};

// Approve teacher
export const approveTeacher = async (teacherId) => {
  try {
    const token = localStorage.getItem('accessToken');
    
    const response = await axios.post(
      `${API_URL}/teacher-verification/`,
      {
        user_id: teacherId,
        teacher_verification_status: 'Approved'
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(error.response?.data?.message || error.response?.data?.error || 'Failed to approve teacher');
  }
};

// Reject teacher - using teacher-verification endpoint
export const rejectTeacher = async (teacherId) => {
  try {
    const token = localStorage.getItem('accessToken');
    
    const response = await axios.post(
      `${API_URL}/teacher-verification/`,
      {
        user_id: teacherId,
        teacher_verification_status: 'Rejected'
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(error.response?.data?.message || error.response?.data?.error || 'Failed to reject teacher');
  }
};


// =============================================
// ===== BOARD MANAGEMENT APIs =====
// =============================================

/**
 * Get all education boards
 * GET /education-boards/
 */
export const getBoards = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    
    const response = await axios.get(
      `${API_URL}/education-boards/`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('API Error - Get Boards:', error);
    throw new Error(error.response?.data?.message || error.response?.data?.error || 'Failed to fetch boards');
  }
};

/**
 * Add a new education board
 * POST /add-education-board/
 * @param {string} boardName - Name of the board
 */
export const addBoard = async (boardName) => {
  try {
    const token = localStorage.getItem('accessToken');
    
    const response = await axios.post(
      `${API_URL}/add-education-board/`,
      {
        board_name: boardName,
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('API Error - Add Board:', error);
    throw new Error(error.response?.data?.message || error.response?.data?.error || 'Failed to add board');
  }
};

/**
 * Edit an education board
 * PUT /edit-education-board/{id}/
 * @param {number} id - Board ID
 * @param {string} boardName - New board name
 */
export const editBoard = async (id, boardName) => {
  try {
    const token = localStorage.getItem('accessToken');
    
    const response = await axios.put(
      `${API_URL}/edit-education-board/${id}/`,
      {
        board_name: boardName,
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('API Error - Edit Board:', error);
    throw new Error(error.response?.data?.message || error.response?.data?.error || 'Failed to edit board');
  }
};

/**
 * Delete an education board
 * DELETE /delete-education-board/{id}/
 * @param {number} id - Board ID
 */
export const deleteBoard = async (id) => {
  try {
    const token = localStorage.getItem('accessToken');
    
    const response = await axios.delete(
      `${API_URL}/delete-education-board/${id}/`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('API Error - Delete Board:', error);
    throw new Error(error.response?.data?.message || error.response?.data?.error || 'Failed to delete board');
  }
};
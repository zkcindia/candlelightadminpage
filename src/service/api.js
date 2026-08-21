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

// Create a special day - Simple and clean
export const createSpecialDay = async (formData) => {
  try {
    const response = await fetch(`${API_URL}/create-special-day/`, {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create special day');
    }
    
    return data;
  } catch (error) {
    console.error('Error creating special day:', error);
    throw error;
  }
};

export default {
  createSpecialDay
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

// src/service/api.js - Fix the addClass function

// =============================================
// ===== CLASS MANAGEMENT APIs =====
// =============================================

/**
 * Get all classes for a specific board
 * GET /get-all-classes/?board_id={boardId}
 * @param {number} boardId - Board ID
 */
export const getClasses = async (boardId) => {
  try {
    const token = localStorage.getItem('accessToken');
    
    const response = await axios.get(
      `${API_URL}/get-all-classes/?board_id=${boardId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('API Error - Get Classes:', error);
    throw new Error(error.response?.data?.message || error.response?.data?.error || 'Failed to fetch classes');
  }
};

/**
 * Add a new class to a board (with image upload)
 * POST /add-class/
 * @param {FormData} formData - Form data with board_id, name, image
 */
export const addClass = async (formData) => {
  try {
    const token = localStorage.getItem('accessToken');
    
    // ✅ IMPORTANT: Don't set Content-Type header for FormData
    // Browser will set it automatically with boundary
    const response = await axios.post(
      `${API_URL}/add-class/`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          // ❌ DO NOT set 'Content-Type': 'multipart/form-data' manually
          // ✅ Let browser set it automatically
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('API Error - Add Class:', error);
    const errorMsg = error.response?.data?.message || 
                     error.response?.data?.error || 
                     'Failed to add class';
    throw new Error(errorMsg);
  }
};

// src/service/api.js - Edit Class function

/**
 * Edit a class
 * PUT /edit-class/{id}/
 * @param {number} id - Class ID
 * @param {Object} data - { name: string }
 */
export const editClass = async (id, data) => {
  try {
    const token = localStorage.getItem('accessToken');
    
    // ✅ API expects: { name: "new name" }
    const response = await axios.put(
      `${API_URL}/edit-class/${id}/`,
      data,  // { name: "new dj" }
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('API Error - Edit Class:', error);
    const errorMsg = error.response?.data?.message || 
                     error.response?.data?.error || 
                     'Failed to edit class';
    throw new Error(errorMsg);
  }
};
/**
 * Delete a class
 * DELETE /delete-class/{id}/
 * @param {number} id - Class ID
 */
export const deleteClass = async (id) => {
  try {
    const token = localStorage.getItem('accessToken');
    
    const response = await axios.delete(
      `${API_URL}/delete-class/${id}/`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('API Error - Delete Class:', error);
    const errorMsg = error.response?.data?.message || 
                     error.response?.data?.error || 
                     'Failed to delete class';
    throw new Error(errorMsg);
  }
};


// src/service/api.js - Add these functions at the end

// =============================================
// ===== SUBJECT MANAGEMENT APIs =====
// =============================================

/**
 * Get all subjects (with optional class filter)
 * GET /get-all-subjects/?class_id={classId}
 * @param {number} classId - Optional class ID to filter
 */
export const getSubjects = async (classId = null) => {
  try {
    const token = localStorage.getItem('accessToken');
    
    const url = classId 
      ? `${API_URL}/get-all-subjects/?class_id=${classId}`
      : `${API_URL}/get-all-subjects/`;
    
    const response = await axios.get(
      url,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('API Error - Get Subjects:', error);
    throw new Error(error.response?.data?.message || error.response?.data?.error || 'Failed to fetch subjects');
  }
};

/**
 * Add a new subject
 * POST /add-subject/
 * @param {FormData} formData - Form data with name, class_id, image
 */
export const addSubject = async (formData) => {
  try {
    const token = localStorage.getItem('accessToken');
    
    const response = await axios.post(
      `${API_URL}/add-subject/`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          // ❌ DO NOT set Content-Type manually for FormData
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('API Error - Add Subject:', error);
    const errorMsg = error.response?.data?.message || 
                     error.response?.data?.error || 
                     'Failed to add subject';
    throw new Error(errorMsg);
  }
};

/**
 * Edit a subject
 * PUT /edit-subject/{id}/
 * @param {number} id - Subject ID
 * @param {Object} data - { name: string }
 */
export const editSubject = async (id, data) => {
  try {
    const token = localStorage.getItem('accessToken');
    
    const response = await axios.put(
      `${API_URL}/edit-subject/${id}/`,
      data,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('API Error - Edit Subject:', error);
    const errorMsg = error.response?.data?.message || 
                     error.response?.data?.error || 
                     'Failed to edit subject';
    throw new Error(errorMsg);
  }
};

/**
 * Delete a subject
 * DELETE /delete-subject/{id}/
 * @param {number} id - Subject ID
 */
export const deleteSubject = async (id) => {
  try {
    const token = localStorage.getItem('accessToken');
    
    const response = await axios.delete(
      `${API_URL}/delete-subject/${id}/`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('API Error - Delete Subject:', error);
    const errorMsg = error.response?.data?.message || 
                     error.response?.data?.error || 
                     'Failed to delete subject';
    throw new Error(errorMsg);
  }
};
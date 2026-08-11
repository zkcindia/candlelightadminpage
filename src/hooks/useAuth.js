// // src/hooks/useAuth.js
// import { useState, useEffect } from 'react';
// import { loginUser } from '../service/api';

// export const useAuth = () => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem('accessToken');
//     const userData = localStorage.getItem('userData');
    
//     if (token && userData) {
//       try {
//         setUser(JSON.parse(userData));
//       } catch {
//         localStorage.clear();
//       }
//     }
//     setLoading(false);
//   }, []);

//   const login = async (credentials) => {
//     try {
//       const response = await loginUser(credentials.email, credentials.password);
      
//       localStorage.setItem('accessToken', response.access_token);
//       localStorage.setItem('refreshToken', response.refresh_token);
      
//       const userData = response.user_data || response.teacher_data || {};
//       localStorage.setItem('userData', JSON.stringify(userData));
//       localStorage.setItem('userId', userData.id);
//       localStorage.setItem('role', userData.role || 'user');
      
//       setUser(userData);
//       return { success: true };
//     } catch (error) {
//       return { success: false, error: error.message };
//     }
//   };

//   const logout = () => {
//     localStorage.clear();
//     setUser(null);
//   };

//   return { user, loading, login, logout };
// };
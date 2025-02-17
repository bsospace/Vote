export const APP_NAME = 'React Enterprise App';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/guest',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  USERS: {
    BASE: '/user',
    PROFILE: '/user/profile',
  },
} as const;

export const ROUTES = {
  HOME: '/',                // หน้าหลัก
  LOGIN: '/login', 
  CALLBACK:'/callback',         // เข้าสู่ระบบ
  PROFILE: '/profile',      // โปรไฟล์ AT03.1.2
} as const;
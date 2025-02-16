export default {
  port: import.meta.env.PORT || 3000,
  apiUrl: import.meta.env.VITE_APP_API_URL || "http://localhost:5000",
  jwtSecret: import.meta.env.JWT_SECRET || "your-secret-key",
};

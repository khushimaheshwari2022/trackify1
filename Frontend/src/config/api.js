// API Configuration
// This file centralizes the backend API URL
// Use environment variable in production, localhost in development

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export default API_URL;


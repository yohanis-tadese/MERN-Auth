import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

// Fetch all users
export const fetchAllUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

// Sign up new user
export const signup = async (userData) => {
  const response = await api.post("/auth/signup", userData);
  return response.data;
};

// Sign in user
export const signin = async (userData) => {
  const response = await api.post("/auth/signin", userData);
  return response.data;
};

// Sign out user
export const signout = async () => {
  const response = await api.get("/auth/signout");
  return response.data;
};

// Google OAuth login
export const googleLogin = () => {
  window.location.href = "http://localhost:3000/api/auth/google";
};

// Google OAuth callback
export const googleCallback = async (code) => {
  const response = await api.get(`/auth/google/callback?code=${code}`);
  return response.data;
};

// Update user data
export const updateUser = async (userData) => {
  const response = await api.patch("/users/update/me", userData);
  return response.data;
};

// Delete current user
export const deleteUser = async () => {
  const response = await api.delete("/users/delete/me");
  return response.data;
};

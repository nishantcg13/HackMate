import axios from "axios";

// Base API URL pointing to the backend (via Vite proxy or direct port 3000)
const API_BASE_URL = "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach Bearer token to outgoing requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==========================================
// 1. AUTH APIs (Ready in Backend)
// ==========================================

// Register a new user
export const registerApi = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);
    return response.data;
  } catch (err) {
    // Also try root /auth in case
    const fallback = await api.post("/auth", userData);
    return fallback.data;
  }
};

// Login user
export const loginApi = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  if (response.data?.token) {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user || {}));
  }
  return response.data;
};

// Get current logged-in user profile
export const getMeApi = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

// Logout helper
export const logoutApi = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// ==========================================
// 2. JOIN REQUEST APIs (Ready in Backend)
// ==========================================

// Send Join Request to a team
export const sendJoinRequestApi = async (teamId, message = "") => {
  const response = await api.post("/join-requests", { teamId, message });
  return response.data;
};

// Get all received requests
export const getReceivedRequestsApi = async () => {
  const response = await api.get("/join-requests/received");
  return response.data;
};

// Get all sent requests
export const getSentRequestsApi = async () => {
  const response = await api.get("/join-requests/sent");
  return response.data;
};

// Accept a join request
export const acceptJoinRequestApi = async (requestId) => {
  const response = await api.patch(`/join-requests/${requestId}/accept`);
  return response.data;
};

// Reject a join request
export const rejectJoinRequestApi = async (requestId) => {
  const response = await api.patch(`/join-requests/${requestId}/reject`);
  return response.data;
};

// Cancel/Delete a sent join request
export const cancelJoinRequestApi = async (requestId) => {
  const response = await api.delete(`/join-requests/${requestId}`);
  return response.data;
};

// ==========================================
// 3. TEAM MEMBER APIs (Ready in Backend)
// ==========================================

// Get members of a specific team
export const getTeamMembersApi = async (teamId) => {
  const response = await api.get(`/team-members/${teamId}/members`);
  return response.data;
};

// Leave a team
export const leaveTeamApi = async (teamId) => {
  const response = await api.delete(`/team-members/${teamId}/leave`);
  return response.data;
};

// Remove a team member (leader only)
export const removeTeamMemberApi = async (teamId, userId) => {
  const response = await api.delete(`/team-members/${teamId}/members/${userId}`);
  return response.data;
};

// Add team member directly (leader only)
export const addTeamMemberApi = async (teamId, userId) => {
  const response = await api.post(`/team-members/${teamId}/members`, { userId });
  return response.data;
};

// ==========================================
// 4. USERS & TEAMS APIs (From MongoDB)
// ==========================================

// Get all users / participants from MongoDB
export const getUsersApi = async (name = "", skill = "") => {
  const params = {};
  if (name) params.name = name;
  if (skill && skill !== "All Skills") params.skill = skill;
  const response = await api.get("/users", { params });
  return response.data;
};

// Get all teams from MongoDB
export const getTeamsApi = async () => {
  const response = await api.get("/teams");
  return response.data;
};

// Get specific team details from MongoDB
export const getTeamByIdApi = async (id) => {
  const response = await api.get(`/teams/${id}`);
  return response.data;
};

// Create a new team in MongoDB
export const createTeamApi = async (teamData) => {
  const response = await api.post("/teams", teamData);
  return response.data;
};

export default api;


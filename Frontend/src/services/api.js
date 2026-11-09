import axios from "axios";

// Base API URL pointing to the backend
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
// 1. AUTH APIs
// ==========================================

// Register a new user
export const registerApi = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
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
// 2. TEAMS APIs (APIs #5 to #13)
// ==========================================

// API #5: Create a team
export const createTeamApi = async (teamData) => {
  const response = await api.post("/teams", teamData);
  return response.data;
};

// API #6: Get all teams with optional filters & pagination
export const getTeamsApi = async (params = {}) => {
  const response = await api.get("/teams", { params });
  return response.data;
};

// API #7: Get team by ID
export const getTeamByIdApi = async (id) => {
  const response = await api.get(`/teams/${id}`);
  return response.data;
};

// API #8: Update team
export const updateTeamApi = async (id, teamData) => {
  const response = await api.put(`/teams/${id}`, teamData);
  return response.data;
};

// API #9: Delete team
export const deleteTeamApi = async (id) => {
  const response = await api.delete(`/teams/${id}`);
  return response.data;
};

// API #10: Get my teams (created or joined)
export const getMyTeamsApi = async () => {
  const response = await api.get("/teams/my-teams");
  return response.data;
};

// API #11: Transfer leadership
export const transferLeadershipApi = async (id, newLeaderId) => {
  const response = await api.patch(`/teams/${id}/leader`, { newLeaderId });
  return response.data;
};

// API #12: Search teams
export const searchTeamsApi = async (params = {}) => {
  const response = await api.get("/teams/search", { params });
  return response.data;
};

// API #13: Get recommended teams
export const getRecommendedTeamsApi = async () => {
  const response = await api.get("/teams/recommended");
  return response.data;
};

// ==========================================
// 3. JOIN REQUEST APIs
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
// 4. TEAM MEMBER APIs
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
// 5. USER & PROFILE APIs
// ==========================================

// Get all users / participants from MongoDB
export const getUsersApi = async (name = "", skill = "") => {
  const params = {};
  if (name) params.name = name;
  if (skill && skill !== "All Skills") params.skill = skill;
  const response = await api.get("/users", { params });
  return response.data;
};

// Update user profile
export const updateUserProfileApi = async (profileData) => {
  const response = await api.put("/users/profile", profileData);
  return response.data;
};

// ==========================================
// 6. HACKATHON APIs
// ==========================================

export const getHackathonsApi = async () => {
  const response = await api.get("/hackathons");
  return response.data;
};

// ==========================================
// 7. CONTACT US APIs
// ==========================================

export const submitContactApi = async (contactData) => {
  const response = await api.post("/contact", contactData);
  return response.data;
};

export const getAllContactsApi = async () => {
  const response = await api.get("/contact");
  return response.data;
};

export default api;

// Simple dummy data matching the screenshot exactly

export const initialUser = {
  name: "Nishant Galande",
  email: "nishant@gmail.com",
  initial: "N",
  about:
    "Passionate developer interested in building real-world solutions and participating in hackathons.",
  skills: ["Java", "Spring Boot", "React", "MongoDB"],
  interests: ["Web Development", "App Development", "Hackathons"],
};

export const initialTeammates = [
  {
    id: 1,
    name: "Aman Patil",
    role: "Full Stack Developer",
    initial: "A",
    avatarColor: "bg-purple-100 text-purple-700",
    skills: ["Java", "React", "MySQL"],
  },
  {
    id: 2,
    name: "Khushi Sharma",
    role: "Flutter Developer",
    initial: "K",
    avatarColor: "bg-pink-100 text-pink-700",
    skills: ["Flutter", "Firebase", "Dart"],
  },
  {
    id: 3,
    name: "Lalit More",
    role: "Backend Developer",
    initial: "L",
    avatarColor: "bg-purple-100 text-purple-700",
    skills: ["Spring Boot", "Java", "MySQL"],
  },
  {
    id: 4,
    name: "Rohan Jadhav",
    role: "DevOps Engineer",
    initial: "R",
    avatarColor: "bg-blue-100 text-blue-700",
    skills: ["Docker", "Linux", "AWS"],
  },
];

export const initialTeams = [
  {
    id: 1,
    name: "ByteBuilders",
    description: "A team for building innovative hackathon projects.",
    leader: "Aman Patil",
    currentMembers: 3,
    maxMembers: 5,
    skills: ["React", "Node.js", "MongoDB"],
    requiredSkills: ["DevOps", "UI/UX"],
    members: [
      { name: "Aman Patil", role: "Leader", initial: "A" },
      { name: "Khushi Sharma", role: "Member", initial: "K" },
      { name: "Rohan Jadhav", role: "Member", initial: "R" },
    ],
    userRole: "Leader", // For My Teams
  },
  {
    id: 2,
    name: "CodeCrew",
    description: "Looking for developers to build a college hackathon project.",
    leader: "Lalit More",
    currentMembers: 2,
    maxMembers: 4,
    skills: ["Java", "Spring Boot", "MySQL"],
    requiredSkills: ["React", "UI/UX"],
    members: [
      { name: "Lalit More", role: "Leader", initial: "L" },
      { name: "Nishant Galande", role: "Member", initial: "N" },
    ],
    userRole: "Member", // For My Teams
  },
];

export const initialRequests = [
  {
    id: 1,
    name: "Rohit Kale",
    team: "ByteBuilders",
    initial: "R",
    skills: ["React", "Node.js"],
    type: "incoming",
  },
  {
    id: 2,
    name: "Sneha More",
    team: "ByteBuilders",
    initial: "S",
    skills: ["Java", "Spring Boot"],
    type: "incoming",
  },
  {
    id: 3,
    name: "CodeCrew",
    team: "CodeCrew",
    initial: "C",
    skills: ["Java", "Spring Boot"],
    type: "my_requests",
  },
];

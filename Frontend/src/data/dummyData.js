// Dummy data matching user screenshot and requirements

export const initialCurrentUser = {
  id: "u1",
  name: "Nishant Galande",
  initials: "NG",
  email: "nishant@example.com",
  role: "Full Stack Developer",
  experienceLevel: "Intermediate",
  bio: "Passionate developer, always eager to learn and build cool things.",
  skills: ["Java", "React", "MongoDB", "C++", "Web Development"],
  avatar: "NG",
  github: "https://github.com/nishant",
  linkedin: "https://linkedin.com/in/nishant",
  stats: {
    hackathons: 5,
    teams: 12,
    requests: 3,
  },
};

export const initialHackathons = [
  {
    id: "h1",
    title: "TechNova Hackathon 2025",
    tagline: "Innovate. Build. Grow.",
    description:
      "A 48-hour hackathon to build innovative solutions to real-world problems. Open for all skill levels! Form a squad and compete for national-level recognition.",
    organizer: "TechNova Hub",
    startDate: "Dec 15 - Dec 17, 2025",
    mode: "Online",
    location: "Online / Virtual",
    prizes: {
      first: "₹50,000",
      second: "₹30,000",
      third: "₹20,000",
    },
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80",
    requiredSkills: ["React", "Node.js", "Python"],
  },
  {
    id: "h2",
    title: "BuildNext Hackathon",
    tagline: "Code the future.",
    description:
      "Collaborative sprint to build high-performance web applications, AI copilots, and cloud platforms.",
    organizer: "BuildNext Labs",
    startDate: "Dec 20 - Dec 22, 2025",
    mode: "Online",
    location: "Online / Virtual",
    prizes: {
      first: "₹45,000",
      second: "₹25,000",
      third: "₹15,000",
    },
    image:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80",
    requiredSkills: ["JavaScript", "Python", "Cloud"],
  },
  {
    id: "h3",
    title: "InnoHacks Global 2026",
    tagline: "Turn ideas into reality.",
    description:
      "Tackle challenges in FinTech, Healthcare, and Sustainable Tech with passionate student developers.",
    organizer: "InnoHacks Community",
    startDate: "Jan 10 - Jan 12, 2026",
    mode: "Offline",
    location: "Pune, India",
    prizes: {
      first: "₹60,000",
      second: "₹35,000",
      third: "₹20,000",
    },
    image:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop&q=80",
    requiredSkills: ["Flutter", "React", "AI/ML"],
  },
];

export const initialTeams = [
  {
    id: "t1",
    name: "DevSquad",
    description: "Building innovative solutions together.",
    hackathonName: "TechNova Hackathon 2025",
    membersCount: 3,
    extraCount: 2,
    members: ["Nishant", "Alex", "Rohan"],
  },
  {
    id: "t2",
    name: "CodeCraze",
    description: "Hack today, innovate tomorrow.",
    hackathonName: "BuildNext Hackathon",
    membersCount: 2,
    extraCount: 1,
    members: ["Sneha", "Karan"],
  },
  {
    id: "t3",
    name: "ByteBuilders",
    description: "Full-stack web solutions and mobile apps.",
    hackathonName: "InnoHacks Global 2026",
    membersCount: 4,
    extraCount: 1,
    members: ["Priya", "David", "Arjun", "Maya"],
  },
];

export const initialRequests = [
  {
    id: "r1",
    name: "Sneha Sharma",
    avatarInitial: "SS",
    message: "Wants to join your team DevSquad",
    role: "UI/UX Designer",
    type: "received",
  },
  {
    id: "r2",
    name: "Aarav Mehta",
    avatarInitial: "A",
    message: "Wants to join your team DevSquad",
    role: "Backend Engineer",
    type: "received",
  },
  {
    id: "r3",
    name: "CodeCraze",
    avatarInitial: "CC",
    message: "Request sent to join team",
    role: "Hackathon Team",
    type: "sent",
  },
];

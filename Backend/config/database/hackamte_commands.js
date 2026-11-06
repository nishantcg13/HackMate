// ============================================================
// HACKMATE - MONGODB COMMANDS
// Technology: MongoDB + Mongosh
// Database: hackmate_db
// IDs: MongoDB ObjectId
//
// Run from Windows CMD:
// mongosh "mongodb://127.0.0.1:27017/hackmate_db" --file "hackmate_commands.js"
//
// IMPORTANT:
// 1. Run this setup script once on a clean database.
// 2. Running the insert sections again will create duplicate-data errors
//    because users.email has a unique index.
// 3. The optional RESET section is destructive. Uncomment it only when
//    you intentionally want to delete all documents from the five collections.
// 4. Demo users do not contain passwords. Register real accounts through
//    the API and store passwords only as bcrypt hashes.
// ============================================================

print("\n========== HACKMATE DATABASE SETUP ==========\n");

// ------------------------------------------------------------
// 1. SELECT DATABASE
// ------------------------------------------------------------

db = db.getSiblingDB("hackmate_db");

print("Using database: " + db.getName());


// ------------------------------------------------------------
// 2. CREATE COLLECTIONS IF THEY DO NOT EXIST
// ------------------------------------------------------------

const collectionNames = [
  "users",
  "hackathons",
  "teams",
  "teamMembers",
  "joinRequests"
];

const existingNames = db.getCollectionNames();

collectionNames.forEach(name => {
  if (!existingNames.includes(name)) {
    db.createCollection(name);
    print("Created: " + name);
  } else {
    print("Already exists: " + name);
  }
});


// ------------------------------------------------------------
// 3. OPTIONAL RESET DEMO DATA - DESTRUCTIVE
// ------------------------------------------------------------

// Uncomment these commands ONLY if you intentionally want to delete
// all documents from the five collections.

// db.users.deleteMany({});
// db.hackathons.deleteMany({});
// db.teams.deleteMany({});
// db.teamMembers.deleteMany({});
// db.joinRequests.deleteMany({});


// ------------------------------------------------------------
// 4. INSERT USERS
// ------------------------------------------------------------

// MongoDB automatically generates _id for every user.
// Save the generated IDs because other collections refer to them.

db.users.insertMany([
  {
    name: "Admin User",
    email: "admin@hackmate.com",
    role: "ADMIN",
    skills: [],
    bio: "HackMate administrator",
    createdAt: new Date()
  },
  {
    name: "Nishant Galande",
    email: "nishant@hackmate.com",
    role: "USER",
    skills: ["Java", "Spring Boot", "MongoDB", "React"],
    bio: "Backend developer",
    createdAt: new Date()
  },
  {
    name: "Rohit Sharma",
    email: "rohit@hackmate.com",
    role: "USER",
    skills: ["React", "JavaScript", "CSS", "Node.js"],
    bio: "Frontend developer",
    createdAt: new Date()
  },
  {
    name: "Shruti Patil",
    email: "shruti@hackmate.com",
    role: "USER",
    skills: ["Node.js", "Express", "MongoDB"],
    bio: "Backend developer",
    createdAt: new Date()
  },
  {
    name: "Amit Kulkarni",
    email: "amit@hackmate.com",
    role: "USER",
    skills: ["Python", "Machine Learning", "Data Analysis"],
    bio: "Developer interested in data applications",
    createdAt: new Date()
  },
  {
    name: "Sneha Desai",
    email: "sneha@hackmate.com",
    role: "USER",
    skills: ["Flutter", "Dart", "Firebase", "UI Design"],
    bio: "Mobile application developer",
    createdAt: new Date()
  }
]);

// Display users and their generated IDs.
db.users.find({}, { name: 1, email: 1, role: 1 });


// ------------------------------------------------------------
// 5. INSERT HACKATHONS
// ------------------------------------------------------------

// createdBy must contain the _id of an existing user.
// This example finds the admin ID using the admin email.

const admin = db.users.findOne({ email: "admin@hackmate.com" });

db.hackathons.insertMany([
  {
    title: "TechFest Buildathon 2026",
    description: "Build solutions for real-world problems.",
    organizer: "TechFest Committee",
    location: "Mumbai",
    mode: "OFFLINE",
    startDate: ISODate("2026-12-10T00:00:00Z"),
    endDate: ISODate("2026-12-12T00:00:00Z"),
    registrationDeadline: ISODate("2026-12-01T00:00:00Z"),
    status: "UPCOMING",
    createdBy: admin._id,
    createdAt: new Date()
  },
  {
    title: "CodeVerse 2026",
    description: "A 24-hour web development hackathon.",
    organizer: "CodeVerse Community",
    location: "Pune",
    mode: "HYBRID",
    startDate: ISODate("2026-12-18T00:00:00Z"),
    endDate: ISODate("2026-12-19T00:00:00Z"),
    registrationDeadline: ISODate("2026-12-10T00:00:00Z"),
    status: "UPCOMING",
    createdBy: admin._id,
    createdAt: new Date()
  },
  {
    title: "Innovathon Campus Challenge",
    description: "Build an innovative technology solution.",
    organizer: "Innovation Cell",
    location: "Online",
    mode: "ONLINE",
    startDate: ISODate("2027-01-15T00:00:00Z"),
    endDate: ISODate("2027-01-16T00:00:00Z"),
    registrationDeadline: ISODate("2027-01-05T00:00:00Z"),
    status: "UPCOMING",
    createdBy: admin._id,
    createdAt: new Date()
  }
]);

// Display hackathons and their generated IDs.
db.hackathons.find({}, { title: 1, createdBy: 1 });


// ------------------------------------------------------------
// 6. INSERT TEAMS
// ------------------------------------------------------------

// leaderId references users._id.
// hackathonId references hackathons._id.

const nishant = db.users.findOne({ email: "nishant@hackmate.com" });
const rohit = db.users.findOne({ email: "rohit@hackmate.com" });
const shruti = db.users.findOne({ email: "shruti@hackmate.com" });
const sneha = db.users.findOne({ email: "sneha@hackmate.com" });

const techFest = db.hackathons.findOne({
  title: "TechFest Buildathon 2026"
});

const codeVerse = db.hackathons.findOne({
  title: "CodeVerse 2026"
});

const innovathon = db.hackathons.findOne({
  title: "Innovathon Campus Challenge"
});

db.teams.insertMany([
  {
    name: "Byte Builders",
    description: "Full-stack application developers.",
    hackathonId: techFest._id,
    leaderId: nishant._id,
    requiredSkills: ["React", "Node.js", "MongoDB"],
    maxMembers: 4,
    status: "OPEN",
    createdAt: new Date()
  },
  {
    name: "Code Crusaders",
    description: "Backend and API development team.",
    hackathonId: codeVerse._id,
    leaderId: rohit._id,
    requiredSkills: ["Java", "Spring Boot", "MySQL"],
    maxMembers: 5,
    status: "OPEN",
    createdAt: new Date()
  },
  {
    name: "Pixel Pioneers",
    description: "Mobile application development team.",
    hackathonId: innovathon._id,
    leaderId: sneha._id,
    requiredSkills: ["Flutter", "Firebase", "UI Design"],
    maxMembers: 4,
    status: "OPEN",
    createdAt: new Date()
  }
]);

// Display teams and their generated IDs.
db.teams.find({}, { name: 1, hackathonId: 1, leaderId: 1 });


// ------------------------------------------------------------
// 7. INSERT TEAM MEMBERS
// ------------------------------------------------------------

// teamId references teams._id.
// userId references users._id.
// The team leader is also stored in teamMembers.

const byteBuilders = db.teams.findOne({ name: "Byte Builders" });
const codeCrusaders = db.teams.findOne({ name: "Code Crusaders" });
const pixelPioneers = db.teams.findOne({ name: "Pixel Pioneers" });

const amit = db.users.findOne({ email: "amit@hackmate.com" });

db.teamMembers.insertMany([
  {
    teamId: byteBuilders._id,
    userId: nishant._id,
    role: "LEADER",
    joinedAt: new Date()
  },
  {
    teamId: byteBuilders._id,
    userId: shruti._id,
    role: "MEMBER",
    joinedAt: new Date()
  },
  {
    teamId: codeCrusaders._id,
    userId: rohit._id,
    role: "LEADER",
    joinedAt: new Date()
  },
  {
    teamId: pixelPioneers._id,
    userId: sneha._id,
    role: "LEADER",
    joinedAt: new Date()
  },
  {
    teamId: pixelPioneers._id,
    userId: amit._id,
    role: "MEMBER",
    joinedAt: new Date()
  }
]);


// ------------------------------------------------------------
// 8. INSERT JOIN REQUESTS
// ------------------------------------------------------------

db.joinRequests.insertMany([
  {
    teamId: byteBuilders._id,
    userId: rohit._id,
    message: "I can contribute React and frontend skills.",
    status: "PENDING",
    createdAt: new Date()
  },
  {
    teamId: codeCrusaders._id,
    userId: shruti._id,
    message: "I have backend API development experience.",
    status: "REJECTED",
    createdAt: new Date()
  },
  {
    teamId: pixelPioneers._id,
    userId: amit._id,
    message: "I can help with data analysis.",
    status: "ACCEPTED",
    createdAt: new Date()
  }
]);


// ------------------------------------------------------------
// 9. CREATE INDEXES
// ------------------------------------------------------------

// Prevent duplicate email addresses.
db.users.createIndex({ email: 1 }, { unique: true });

// A user can be a member of a team only once.
db.teamMembers.createIndex(
  { teamId: 1, userId: 1 },
  { unique: true }
);

// A user can have only one PENDING request for a particular team.
db.joinRequests.createIndex(
  { teamId: 1, userId: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "PENDING" }
  }
);

// Indexes for commonly used filters.
db.hackathons.createIndex({ createdBy: 1 });
db.hackathons.createIndex({ status: 1, startDate: 1 });
db.teams.createIndex({ hackathonId: 1, status: 1 });
db.teams.createIndex({ leaderId: 1 });
db.teamMembers.createIndex({ userId: 1 });
db.joinRequests.createIndex({ userId: 1, status: 1 });
db.joinRequests.createIndex({ teamId: 1, status: 1 });


// ------------------------------------------------------------
// 10. VERIFY DATABASE AND SAMPLE RECORDS
// ------------------------------------------------------------

print("\n========== COLLECTIONS ==========");
printjson(db.getCollectionNames());

print("\n========== USERS ==========");
db.users.find().forEach(printjson);

print("\n========== HACKATHONS ==========");
db.hackathons.find().forEach(printjson);

print("\n========== TEAMS ==========");
db.teams.find().forEach(printjson);

print("\n========== TEAM MEMBERS ==========");
db.teamMembers.find().forEach(printjson);

print("\n========== JOIN REQUESTS ==========");
db.joinRequests.find().forEach(printjson);

print("\n========== DOCUMENT COUNTS ==========");
print("Users: " + db.users.countDocuments());
print("Hackathons: " + db.hackathons.countDocuments());
print("Teams: " + db.teams.countDocuments());
print("Team members: " + db.teamMembers.countDocuments());
print("Join requests: " + db.joinRequests.countDocuments());


// ------------------------------------------------------------
// 11. USER / PROFILE TEST COMMANDS
// ------------------------------------------------------------

// Find a user by email and ObjectId.
const user = db.users.findOne({ email: "nishant@hackmate.com" });
db.users.findOne({ _id: user._id });

// Find by email.
db.users.findOne({ email: "nishant@hackmate.com" });

// Find users with a particular skill.
db.users.find({ skills: "React" });

// Update a user's profile.
db.users.updateOne(
  { _id: user._id },
  {
    $set: {
      bio: "Java and Spring Boot developer",
      name: "Nishant Galande"
    }
  }
);

// Add a skill without creating duplicates.
db.users.updateOne(
  { _id: user._id },
  { $addToSet: { skills: "Node.js" } }
);


// ------------------------------------------------------------
// 12. HACKATHON TEST COMMANDS
// ------------------------------------------------------------

// View all hackathons.
db.hackathons.find();

// View upcoming hackathons.
db.hackathons.find({ status: "UPCOMING" });

// Search hackathon title.
db.hackathons.find({
  title: { $regex: "code", $options: "i" }
});

// Filter by mode.
db.hackathons.find({ mode: "ONLINE" });

// Sort by start date.
db.hackathons.find().sort({ startDate: 1 });

// Get hackathons created by a particular user.
const loggedInUser = db.users.findOne({
  email: "admin@hackmate.com"
});

db.hackathons.find({ createdBy: loggedInUser._id });

// Count hackathons created by that user.
db.hackathons.countDocuments({
  createdBy: loggedInUser._id
});

// Update a hackathon.
const hackathon = db.hackathons.findOne({
  title: "TechFest Buildathon 2026"
});

db.hackathons.updateOne(
  { _id: hackathon._id },
  { $set: { location: "Pune" } }
);

// Check a hackathon and its dependent teams before deletion.
db.hackathons.findOne({ _id: hackathon._id });
db.teams.find({ hackathonId: hackathon._id });


// ------------------------------------------------------------
// 13. TEAM TEST COMMANDS
// ------------------------------------------------------------

// View all teams.
db.teams.find();

// View open teams.
db.teams.find({ status: "OPEN" });

// Teams for a particular hackathon.
const selectedHackathon = db.hackathons.findOne({
  title: "TechFest Buildathon 2026"
});

db.teams.find({ hackathonId: selectedHackathon._id });

// Teams led by a particular user.
db.teams.find({ leaderId: nishant._id });

// Search team by name.
db.teams.find({
  name: { $regex: "Byte", $options: "i" }
});


// ------------------------------------------------------------
// 14. TEAM MEMBER TEST COMMANDS
// ------------------------------------------------------------

// View all memberships.
db.teamMembers.find();

// View members belonging to a team.
db.teamMembers.find({ teamId: byteBuilders._id });

// View teams in which a user is a member.
db.teamMembers.find({ userId: shruti._id });


// ------------------------------------------------------------
// 15. JOIN REQUEST TEST COMMANDS
// ------------------------------------------------------------

// View all requests.
db.joinRequests.find();

// View pending requests.
db.joinRequests.find({ status: "PENDING" });

// Requests sent by a user.
db.joinRequests.find({ userId: rohit._id });

// Requests received for a team.
db.joinRequests.find({
  teamId: byteBuilders._id,
  status: "PENDING"
});


// ------------------------------------------------------------
// 16. ADMIN PANEL TEST COMMANDS
// ------------------------------------------------------------

// Verify admin account.
db.users.findOne({
  email: "admin@hackmate.com",
  role: "ADMIN"
});

// Admin: list users without password fields.
db.users.find(
  {},
  { name: 1, email: 1, role: 1, skills: 1 }
);

// Admin: list all hackathons.
db.hackathons.find();

// Admin: list all teams.
db.teams.find();

// Dashboard counts.
print("\n========== ADMIN DASHBOARD COUNTS ==========");
print("Total users: " + db.users.countDocuments());
print("Total hackathons: " + db.hackathons.countDocuments());
print("Total teams: " + db.teams.countDocuments());
print("Total team members: " + db.teamMembers.countDocuments());
print("Pending requests: " +
  db.joinRequests.countDocuments({ status: "PENDING" }));

print("Upcoming hackathons: " +
  db.hackathons.countDocuments({ status: "UPCOMING" }));

print("Ongoing hackathons: " +
  db.hackathons.countDocuments({ status: "ONGOING" }));

print("Completed hackathons: " +
  db.hackathons.countDocuments({ status: "COMPLETED" }));


// ------------------------------------------------------------
// 17. COLLECTION REFERENCES (REFERENCE GUIDE)
// ------------------------------------------------------------

// users._id
//   -> hackathons.createdBy
//   -> teams.leaderId
//   -> teamMembers.userId
//   -> joinRequests.userId
//
// hackathons._id
//   -> teams.hackathonId
//
// teams._id
//   -> teamMembers.teamId
//   -> joinRequests.teamId
//
// All reference fields above store ObjectIds.


// ------------------------------------------------------------
// 18. BACKEND VALIDATION RULES (REFERENCE ONLY)
// ------------------------------------------------------------

// 1. Email must be unique.
// 2. Only ADMIN can create, update or delete hackathons.
// 3. Only authenticated users can create teams and send requests.
// 4. A team leader must be an existing user.
// 5. A team must reference an existing hackathon.
// 6. A join request must reference an existing user and team.
// 7. A user cannot send another PENDING request to the same team.
// 8. A user cannot be added to the same team twice.
// 9. Only the relevant team leader can accept or reject a request.
// 10. Check team capacity before accepting a request.
// 11. When a request is accepted, add the user to teamMembers and update
//     the request status. Keep both operations consistent.
// 12. A user cannot send a join request to their own team.
// 13. Do not delete a hackathon while teams depend on it unless the backend
//     deliberately handles those dependent records.
// 14. Never return password hashes in API responses.

print("\n========== HACKMATE SCRIPT FINISHED ==========\n");
print("Database: " + db.getName());
print("Users: " + db.users.countDocuments());
print("Hackathons: " + db.hackathons.countDocuments());
print("Teams: " + db.teams.countDocuments());
print("Team members: " + db.teamMembers.countDocuments());
print("Join requests: " + db.joinRequests.countDocuments());

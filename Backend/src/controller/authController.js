import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";

const JWT_SECRET = process.env.JWT_SECRET || "hello@123";

export async function registerUser(request, response) {
  try {
    let { name, email, password, skills, bio } = request.body;

    if (!name || !email || !password) {
      return response.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return response.status(400).json({ message: "A user with this email already exists" });
    }

    let hashedPassword = await bcrypt.hash(password, 10);
    let createdUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      skills: skills || [],
      bio: bio || "",
    });

    return response.status(201).json({
      message: "User created successfully",
      name: createdUser.name,
      email: createdUser.email,
    });
  } catch (error) {
    console.error("Register User Error:", error);
    if (error.code === 11000) {
      return response.status(400).json({ message: "A user with this email already exists" });
    }
    return response.status(500).json({ message: error.message || "Internal Server Error" });
  }
}

export async function login(request, response) {
  try {
    let { email, password } = request.body;
    console.log("Hello Jee");

    if (!email || !password) {
      return response.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return response.status(401).json({
        message: "Invalid email or password",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("Hello Jee1");
    console.log(user);

    if (!isPasswordValid) {
      return response
        .status(404)
        .json({ message: "Please enter correct email / password" });
    }

    const token = jwt.sign(
      {
        id: user.id || user._id,
        role: user.role || "USER",
      },
      JWT_SECRET,
    );

    return response.status(200).json({
      message: "Login successful",
      token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return response.status(500).json({ message: "Internal Server Error" });
  }
}
export async function getCurrentUser(request, response) {
  try {
    console.log("1. Inside getCurrentUser");
    console.log("2. Decoded user:", request.user);

    const userId = request.user?.id || request.user?._id;
    const user = await User.findById(userId).select("-password");

    console.log("3. User fetched:", user);

    if (!user) {
      return response.status(404).json({
        message: "User not found",
      });
    }

    return response.status(200).json({
      message: "User profile fetched successfully",
      user,
    });
  } catch (error) {
    console.error("GET ME ERROR:", error);

    return response.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

export async function logout(request, response) {
  
}

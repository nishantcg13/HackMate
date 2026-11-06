import jwt from "jsonwebtoken";
import "dotenv/config";

const JWT_SECRET = process.env.JWT_SECRET || "hello@123";

export default function verifyToken(request, response, next) {
  try {
    const authHeader = request.get("Authorization");

    if (!authHeader) {
      return response.status(401).json({ message: "Token is missing" });
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer" || !parts[1]) {
      return response.status(401).json({
        message: "Invalid authorization header",
      });
    }

    const token = parts[1];

    const isVerified = jwt.verify(token, JWT_SECRET);

    request.user = isVerified;

    next();
  } catch (error) {
    console.log("Auth middleware error:", error.message);

    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError" ||
      error.name === "NotBeforeError"
    ) {
      return response.status(401).json({
        message: "Invalid or expired token",
        error: error.message,
      });
    }

    return response.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

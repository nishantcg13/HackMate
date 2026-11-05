import jwt from "jsonwebtoken";
import "dotenv/config";
const JWT_SECRET = process.env.JWT_SECRET;

export default function verifyToken(request, response, next) {
  try {
    const authHeader = request.get("Authorizatio");

    console.log("Hello");
    if (!authHeader) {
      return response.status(400).send({ message: "Token is misssing" });
    }

    const parts = authHeader.split(" ");

    if (parts.length != 2 || parts[0] != "Bearer" || !parts[1]) {
      return response
        .status(401)
        .send({ message: "Invalid authorization header" });
    }

    const token = parts[1];

    const isVerified = jwt.verify(token, JWT_SECRET);
    console.log("verified: ", isVerified);
    next();
  } catch (error) {
    conmsole.log(error.message);
    return response.status(400).json();
  }
}


import jwt from "jsonwebtoken";
import "dotenv/config";

const JWT_SECRET = process.env.JWT_SECRET;

export default function verifyToken(req, res, next) {
    try {
        const authHeader = req.get("Authorization");

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Token is missing"
            });
        }

        const parts = authHeader.split(" ");

        if (parts.length !== 2 || parts[0] !== "Bearer" || !parts[1]) {
            return res.status(401).json({
                success: false,
                message: "Invalid authorization header"
            });
        }

        const token = parts[1];

        const decoded = jwt.verify(token, JWT_SECRET);

        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
}

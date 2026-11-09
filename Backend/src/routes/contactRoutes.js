import express from "express";
import { submitContact, getAllContacts } from "../controller/contactController.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", submitContact);
router.get("/", verifyToken, getAllContacts);

export default router;


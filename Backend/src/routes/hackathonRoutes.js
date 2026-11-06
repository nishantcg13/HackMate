import { Router } from "express";
import {
  getAllHackathons,
  getHackathonById,
  updateHackathon,
  searchHackathon,
  getTeamsByHackathon,
  createHackathon,
  deleteHackathon,
} from "../controller/hackathonController.js";

const hackathonRoutes = Router();
console.log("1");

hackathonRoutes.get("/", getAllHackathons);
hackathonRoutes.get(
  "/search",
  (req, res, next) => {
    console.log("Search route reached");
    next();
  },
  searchHackathon,
);
hackathonRoutes.get("/:id", getHackathonById);
hackathonRoutes.patch("/:id", updateHackathon);
hackathonRoutes.delete("/:id", deleteHackathon);
hackathonRoutes.get("/team/:id", getTeamsByHackathon);
hackathonRoutes.post("/", createHackathon);
export default hackathonRoutes;

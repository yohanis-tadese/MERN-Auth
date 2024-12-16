import express from "express";
import {
  getAllUsers,
  deleteMe,
  updateMe,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAllUsers);
router.patch("/update/me", verifyToken, updateMe);
router.delete("/delete/me", verifyToken, deleteMe);

export default router;

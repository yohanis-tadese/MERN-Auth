import express from "express";
import {
  signin,
  signup,
  signout,
  googleCallback,
} from "../controllers/auth.controller.js";
import passport from "passport";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/signout", signout);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  googleCallback
);

export default router;

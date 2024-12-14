import User from "../models/userModels.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import catchAsync from "../utils/catchAsync.js";
import CustomError from "../utils/customError.js";

// Sign up users
export const signup = catchAsync(async (req, res, next) => {
  const { fullName, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new CustomError("Email already in use", 400);
  }

  const hashedPassword = await bcryptjs.hash(password, 10);

  const newUser = await User.create({
    fullName,
    email,
    password: hashedPassword,
  });

  res.status(201).json({ message: "User created successfully", user: newUser });
});

// Sign in users
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const validUser = await User.findOne({ email });
  if (!validUser) {
    throw new CustomError("User not found", 404);
  }

  const validPassword = await bcryptjs.compare(password, validUser.password);
  if (!validPassword) {
    throw new CustomError("Wrong credentials", 401);
  }

  const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

  const { password: hashedPassword, ...rest } = validUser._doc;

  const expiryDate = new Date(Date.now() + 3600000);

  res
    .cookie("access_token", token, { httpOnly: true, expires: expiryDate })
    .status(200)
    .json(rest);
});

// googe auth
export const googleLogin = catchAsync(async (req, res) => {
  const { googleId } = req.user;

  let user = await User.findOne({ googleId });

  if (!user) {
    return res
      .status(404)
      .json({ success: false, message: "User not found in the database" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.cookie("access_token", token, { httpOnly: true }).status(200).json({
    success: true,
    token: token,
    user: user,
  });
});

export const logout = catchAsync(async (req, res) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res
          .status(500)
          .json({ success: false, message: "Failed to sign out" });
      }
    });
  }

  res.status(200).json({ success: true, message: "Signout successful!" });
});

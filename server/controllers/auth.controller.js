import User from "../models/user.models.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { catchAsync } from "../utils/catchAsync.js";
import { errorHandler } from "../utils/customError.js";

// Signup Users
export const signup = async (req, res, next) => {
  const { fullName, email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res
      .status(400)
      .json({ status: false, message: "Email already taken" });
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ fullName, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json({
      success: true,
      message: "User created successfully",
      newUser,
    });
  } catch (error) {
    next(error);
  }
};

// Sign in users
export const signin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const validUser = await User.findOne({ email });
  if (!validUser) {
    throw new errorHandler(404, "User not found");
  }

  const validPassword = bcryptjs.compare(password, validUser.password);
  if (!validPassword) {
    throw new errorHandler(401, "Wrong credentials");
  }

  const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

  const { password: hashedPassword, ...rest } = validUser._doc;

  const expiryDate = new Date(Date.now() + 3600000);

  res
    .cookie("access_token", token, { httpOnly: true, expires: expiryDate })
    .status(200)
    .json(rest);
});

export const googleCallback = catchAsync((req, res) => {
  const user = req.user;

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.cookie("access_token", token, { httpOnly: true, maxAge: 3600000 });

  res.status(200).json({
    success: true,
    message: "Google login successful",
    token,
  });
});

// Signout User
export const signout = catchAsync(async (req, res) => {
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

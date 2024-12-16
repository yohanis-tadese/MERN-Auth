import User from "../models/user.models.js";
import { catchAsync } from "../utils/catchAsync.js";
import { errorHandler } from "../utils/customError.js";
import bcryptjs from "bcryptjs";

// Get All user
export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find().select("-password");

  if (users.length === 0) {
    res.status(400).json({
      success: true,
      message: "User not found",
      data: [],
    });
  }

  res.status(200).json({ success: true, data: users });
});

// Update user
export const updateMe = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  if (!userId) {
    return next(errorHandler(401, "You can update only your account!"));
  }

  const { username, email, password, profilePicture } = req.body;

  if (username) {
    const existingUser = await User.findOne({ username });
    if (existingUser && existingUser._id.toString() !== userId.toString()) {
      return res
        .status(400)
        .json({ success: false, message: "Username already taken" });
    }
  }

  if (email) {
    const existingEmail = await User.findOne({ email });
    if (existingEmail && existingEmail._id.toString() !== userId.toString()) {
      return res
        .status(400)
        .json({ success: false, message: "Email already taken" });
    }
  }

  if (password) {
    req.body.password = bcryptjs.hashSync(password, 10);
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        username: username,
        email: email,
        password: password,
        profilePicture: profilePicture,
      },
    },
    { new: true }
  );

  const { password: hashedPassword, ...rest } = updatedUser._doc;
  res.status(200).json({
    success: "true",
    message: "User updated successfully",
    rest,
  });
});

// Delete user
export const deleteMe = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  if (!userId) {
    return next(errorHandler(401, "You can delete only your account!"));
  }

  await User.findByIdAndDelete(userId);
  res.status(200).json({
    success: false,
    message: "User has been deleted...",
  });
});

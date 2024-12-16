import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import passport from "passport";
import session from "express-session";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import "./config/passport.js";
import { errorHandler } from "./utils/customError.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Handle undefined routes
app.all("*", (req, res, next) => {
  return next(
    errorHandler(404, `Can't find ${req.originalUrl} on this server!`)
  );
});

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
  });
});

connectDB();

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});

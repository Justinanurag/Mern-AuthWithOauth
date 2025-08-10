import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";

import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import OauthRouter from "./routes/OauthRouter.js"; // Renamed to OauthRouter for clarity
import "./config/passportConfig.js"; // Just import to register the strategy

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

connectDB();

// Allowed frontend origins (for development)
const allowedOrigins = ["http://localhost:5173"];

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.JWT_SECRET|| "your_secret_key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, 
  },
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/auth", OauthRouter); 

// Start server
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});

import express from "express";
import passport from "passport";
import userAuth from '../middleware/userAuth.js';
import { getUserData } from '../controllers/userControler.js';

const OauthRouter = express.Router();
OauthRouter.get("/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

OauthRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    successRedirect: "http://localhost:5173",
  })
);
//Get user details
OauthRouter.get("/data",userAuth,getUserData, (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } else {
    res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
  }
});

OauthRouter.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Logout failed" });
    }
    res.status(200).json({ success: true, message: "Logged out" });
  });
});

export default OauthRouter;

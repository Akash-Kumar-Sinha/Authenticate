// routes/route.ts
import express, { Request, Response } from "express";
import passport from "passport";

import "../middleware/passportGoogle";
import "../middleware/passportGithub";
import "../middleware/passport";

import register from "../controller/register";
import login from "../controller/login";
import getUser from "../controller/getUser";
import getSocialUsers from "../controller/getSocialUsers";
import verifyToken from "../utils/verifyToken";
import idVerify from "../utils/idVerify";

const router = express.Router();

router.use(passport.initialize());

router.post("/signup", register);

router.post("/signin", login);

router.get("/success", getSocialUsers);

router.get("/logout", (req: Request, res: Response) => {
  res.clearCookie("connect.sid", { path: "/" }); // Clear session cookie
  res.status(200).send("Logout successful");
});

router.get("/failed", (req: Request, res: Response) => {
  res.status(401).json({
    error: true,
    message: "Login Failed",
  });
});

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: `http://localhost:5173/home`,
    failureRedirect: "/failed",
  })
);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    successRedirect: `http://localhost:5173/home`,
    failureRedirect: "/auth/failed",
  })
);

router.get("/user", passport.authenticate("jwt", { session: false }), getUser);

router.get("/verify/:token", verifyToken)

router.get("/verifyemail", passport.authenticate("jwt", { session: false }), idVerify)

export default router;

import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

if (!JWT_SECRET_KEY) {
  throw new Error(
    "JWT_SECRET_KEY is not defined in the environment variables."
  );
}
interface User {
  id: string;
  name: string;
  email: string;
  hashedPassword: string | null;
  emailVerified: boolean | null;
  type: string;
}

const getSocialUsers = (req: Request, res: Response) => {
  if (req.user) {
    const users: User = req.user as User;
    const payload = {
      email: users.email,
      id: users.id,
    };

    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "1d" });

    res.status(200).json({
      error: false,
      message: "Login successful",
      user: req.user,
      token: token,
    });
  } else {
    console.log("auth.success");
    res.status(403).json({ error: true, message: "NotAuthorized" });
  }
};

export default getSocialUsers;
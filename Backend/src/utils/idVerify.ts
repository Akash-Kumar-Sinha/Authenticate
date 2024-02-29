import { Request, Response } from "express";
import { prisma } from "../db";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import verifyEmail from "./verifyMail";

interface User {
  id: string;
  name: string;
  email: string;
  hashedPassword: string | null;
  emailVerified: boolean;
  type: string;
}

const idVerify = async (req: Request, res: Response) => {
  try {
    const user = req.user as User;
    const emailToken = jwt.sign(
      { userId: user.id },
      crypto.randomBytes(64).toString("hex"),
      { expiresIn: "5m" }
    );

    await prisma.user.update({
      where: { id: user.id },
      data: { emailToken: emailToken },
    });
    const link = `${process.env.SERVER_PAGE_URL}/auth/verify/${emailToken}`;

    await verifyEmail(user.email, link);

    setTimeout(() => {
      res.status(201).json({ message: "Email sent, check your email" });
    }, 360000);

    user.hashedPassword = null;
    const updatedUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });
    return updatedUser;
  } catch (error) {
    console.log(error);
  }
};

export default idVerify;

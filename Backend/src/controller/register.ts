import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../db";
import jwt from 'jsonwebtoken'; 

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

if (!JWT_SECRET_KEY) {
    throw new Error(
      "JWT_SECRET_KEY is not defined in the environment variables."
    );
  }

const register = async (req: Request, res: Response) => {
  const { email, name, password } = req.body;

  try {
    if (!email || !name || !password) {
      return res
        .status(400)
        .json({ error: "Missing email, name, or password" });
    }

    const existingUser = await prisma?.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return res.status(409).json({ message: "User already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
      },
    });

    if (!user) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    user.hashedPassword = null;

        const payload = {
            email: email,
            id: user.id,
        }

        const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "1d" })

    res.status(201).json({ message: "Registration successful", user, token });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default register;

import { Request, Response } from "express";
import { prisma } from "../db";

const verifyToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    
    const users = await prisma.user.findMany({
      where: {
        emailToken: token,
      },
    });

    if (users.length > 0) {
      for (const user of users) {
        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            emailVerified: true,
            emailToken: null,
          },
        });
      }

      res.status(200).send("Email verified successfully");
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

export default verifyToken;
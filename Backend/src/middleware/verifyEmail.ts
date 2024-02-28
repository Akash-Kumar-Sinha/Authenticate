import { Request, Response } from "express";
import { prisma } from "../db";

const verifyEmail = async (res: Response, req: Request) =>{
    try {
        const emailToken = req.body.emailToken;
        if(!emailToken) return res.status(404).json("EmailToken not found")
        const user = await prisma.user.findUnique({emailToken});
    } catch (error) {
        console.log(error)
    }
}

export default verifyEmail;
import { Request, Response } from "express";

const getUser = async (req: Request, res: Response) => {
  const user = req.user;
  return res.status(200).json({ message: "Login successful", user });
};
export default getUser;

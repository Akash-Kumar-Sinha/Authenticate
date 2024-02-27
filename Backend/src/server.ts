// server.ts
import express, { Request, Response } from "express";
import session from "express-session";
import dotenv from "dotenv";
import passport from "passport";
import cors from "cors";

import "./middleware/passportGoogle";
import "./middleware/passportGithub";

dotenv.config();
const app = express();
const port = 5000;

import router from "../src/routes/route";

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use("/auth", router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

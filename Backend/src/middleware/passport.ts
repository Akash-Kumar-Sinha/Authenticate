import passport from "passport";
import {
  Strategy as JwtStrategy,
  StrategyOptions as JwtStrategyOptions,
  ExtractJwt,
  VerifiedCallback,
} from "passport-jwt";

import { prisma } from "../db";
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

interface JwtPayload {
  id: string;
  email: string;
}

if (!JWT_SECRET_KEY) {
  throw new Error(
    "JWT_SECRET_KEY is not defined in the environment variables."
  );
}

const opts: JwtStrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET_KEY,
};

passport.use(
  new JwtStrategy(
    opts,
    async (jwt_payload: JwtPayload, done: VerifiedCallback) => {
      const { email } = jwt_payload;
      try {
        const user = await prisma?.user.findUnique({
          where: {
            email: email,
          },
        });
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

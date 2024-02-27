import passport, { DoneCallback, Profile } from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";

import { prisma } from "../db";

interface User {
  id: string;
  name: string;
  email: string;
  hashedPassword: string | null;
  emailVerified: boolean;
  type: string;
}

if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
  throw new Error(
    "GITHUB_CLIENT_ID is not defined in the environment variables."
  );
}

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/auth/github/callback",
    },
    async (accessToken: string, refreshToken: string, profile: Profile, done: DoneCallback) => {
      try {
        if (!profile.emails){
          return done(new Error("No email found in GitHub profile."));
        }

        // console.log(profile)
        const existingUser = await prisma.user.findUnique({
          where: {
            email: profile.emails[0].value,
          },
        });

        if (existingUser) {
          return done(null, existingUser);
        }

        const user = await prisma.user.create({
          data: {
            name: profile.displayName || profile.username || "Anonymous",
            email: profile.emails[0].value,
            type: "github",
            emailVerified: true
          },
        });

        await prisma.account.create({
          data: {
            type: "github",
            provider: "github",
            providerAccountId: profile.id,
            userId: user.id,
            refresh_token: refreshToken,
            access_token: accessToken,
          },
        });

        return done(null, user);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return done(error);
        } else {
          return done(new Error("An unexpected error occurred."));
        }
      }
    }
  )
);

passport.serializeUser((user, done) => {
    done(null, user);
  });
  
  passport.deserializeUser((user: User, done) => {
    done(null, user);
  });

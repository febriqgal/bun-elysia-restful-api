import { User } from "@prisma/client";
import { Elysia } from "elysia";
import { authService } from "./auth.service";
import jwt from "@elysiajs/jwt";
import { env } from "bun";

export const authController = (app: Elysia) => {
  return app.group("/", (user) =>
    user
      .use(
        jwt({
          secret: String(env.JWT_SECRET),
          name: "jwt",
          exp: "5s",
        })
      )
      .get("/", async ({ jwt, cookie: { auth }, query: { name, email } }) => {
        if (!email || !name) return "Please provide name and email";
        auth.set({
          value: await jwt.sign({ email: String(email), name: String(name) }),
          httpOnly: true,
          priority: "high",
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
          secure: true,
        });

        return `Sign in as ${auth.value}`;
      })
  );
};

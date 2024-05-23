import jwt from "@elysiajs/jwt";
import { env } from "bun";
import { Elysia, t } from "elysia";
import { authService } from "./auth.service";
import { userService } from "../users/user.service";
import bearer from "@elysiajs/bearer";

export const authController = (app: Elysia) =>
  app
    .use(bearer())
    .use(
      jwt({
        secret: String(env.JWT_SECRET_ACCESS_TOKEN),
        name: "access_token_jwt",
        exp: "10m",
      })
    )
    .use(
      jwt({
        name: "refresh_token_jwt",
        secret: String(env.JWT_SECRET_REFRESH_TOKEN),
        exp: "7d",
      })
    )
    .group("/auth", (auth) =>
      auth
        .get(
          "/create-token",
          async ({
            refresh_token_jwt,
            access_token_jwt,

            cookie: { refresh, access },
            query: { id },
          }) =>
            userService
              .getById(String(id))
              .then(async (resultUser) => {
                if (!resultUser.data) return "User not found";
                await refresh_token_jwt
                  .verify(refresh.value)
                  .then(async (isValid) =>
                    !isValid
                      ? refresh.set({
                          value: await refresh_token_jwt.sign({
                            email: resultUser.data.email,
                            name: resultUser.data.name!,
                            type: "refresh_token",
                          }),
                          maxAge: 60 * 60 * 24 * 7,
                          httpOnly: true,
                          path: "/",
                          secure: true,
                        })
                      : console.log("Token verified")
                  );
                await access_token_jwt
                  .verify(access.value)
                  .then(async (isValid) =>
                    !isValid
                      ? access.set({
                          value: await access_token_jwt.sign({
                            email: resultUser.data.email,
                            name: resultUser.data.name!,
                            type: "access_token",
                          }),
                          path: "/",
                          maxAge: 60 * 10,
                          httpOnly: true,
                          secure: true,
                        })
                      : console.log("Token verified")
                  );
              })
              .then(() =>
                authService.getById(String(id)).then((res) => {
                  if (res.data) {
                    authService.updateRefreshToken(String(id), refresh.value);
                    authService.updateAccessToken(String(id), access.value);
                    return res;
                  }
                  authService.createAccessToken(String(id), access.value);
                  authService.createRefreshToken(String(id), refresh.value);
                  return res;
                })
              ),
          {
            query: t.Object({
              id: t.String({ minLength: 1, errorMessage: "ID is required" }),
            }),
            error({ code, error }) {
              if (code === "VALIDATION") {
                const id = error.all.find((x) => x.path === "/id");
                if (id) return id.schema.errorMessage;
              }
            },
          }
        )
        .get(
          "/get-token",
          async ({ query }) =>
            authService
              .getById(String(query.id))
              .then((res) => res.data?.access_token),
          {
            query: t.Object({
              id: t.String({ minLength: 1, errorMessage: "ID is required" }),
            }),
            error({ code, error }) {
              if (code === "VALIDATION") {
                const id = error.all.find((x) => x.path === "/id");
                if (id) return id.schema.errorMessage;
              }
            },
          }
        )
    );

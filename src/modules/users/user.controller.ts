import { Elysia, t } from "elysia";
import { userService } from "./user.service";
import { User } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
export const userController = (app: Elysia) =>
  app.group("/user", (user) =>
    user
      .get(
        "/",
        ({ query: { email, id } }) => {
          if (email) return userService.getByEmail(email);
          if (id) return userService.getById(id);
          return userService.getAll();
        },
        {
          query: t.Object({
            id: t.Optional(t.String({ minLength: 1 })),
            email: t.Optional(t.String({ minLength: 1, maxLength: 50 })),
          }),
          error({ code, error }) {
            if (code === "VALIDATION") {
              const name = error.all.find((x) => x.path === "/name");
              const email = error.all.find((x) => x.path === "/email");
              if (name) return name.message;
              if (email) return email.message;
            }
          },
        }
      )
      .post(
        "/",
        ({ body, set }: { body: User; set: { status: number } }) =>
          userService
            .post(body)
            .then((data) => {
              if (data.status === StatusCodes.CONFLICT) {
                set.status = StatusCodes.CONFLICT;
                return data;
              }
              set.status = StatusCodes.CREATED;
              return data;
            })
            .catch((e) => e),
        {
          body: t.Object({
            name: t.Optional(
              t.String({
                minLength: 10,
                maxLength: 20,
                description: "User name",
              })
            ),
            email: t.String({
              error: "Invalid email address :(",
              description: "Email address",
              examples: "sasasa@sasasa",
              format: "email",
            }),
            password: t.String({
              description:
                "The password must consist of a minimum of 8 and a maximum of 20 characters, contain a minimum of one uppercase letter, one lowercase letter, and one number.",
              error:
                "The password must consist of a minimum of 8 and a maximum of 20 characters, contain a minimum of one uppercase letter, one lowercase letter, and one number.",
              pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,20}$",
            }),
          }),
          error({ code, error }) {
            if (code === "VALIDATION") {
              const name = error.all.find((x) => x.path === "/name");
              const email = error.all.find((x) => x.path === "/email");
              const password = error.all.find((x) => x.path === "/password");
              console.log(password);

              if (name) return name.message;
              if (email) return email.schema.error;
              if (password) return password.schema.error;
            }
          },
        }
      )
  );

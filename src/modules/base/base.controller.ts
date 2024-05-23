import { Elysia, t } from "elysia";

export const baseController = (app: Elysia) =>
  app.group("/base", (base) =>
    base.get(
      "/",
      ({ query }) => {
        return `Welcome ${query.name}`;
      },
      {
        query: t.Object({
          name: t.String({ minLength: 1, maxLength: 10 }),
          email: t.Optional(t.String({ minLength: 1, maxLength: 10 })),
        }),
        error({ code, error }) {
          switch (code) {
            case "VALIDATION":
              const name = error.all.find((x) => x.path === "/name");
              const email = error.all.find((x) => x.path === "/email");

              if (name) return name.message;
              if (email) return email.message;
          }
        },
      }
    )
  );

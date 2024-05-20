import { Elysia } from "elysia";
import { userService } from "./user.service";
import { User } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
export const userController = (app: Elysia) =>
  app.group("/user", (user) =>
    user
      .onBeforeHandle(({ cookie: { auth } }) => {
        console.log(auth.value);
      })
      .onAfterHandle(() => console.log("test"))
      .get("/", ({ query: { email, id } }) => {
        if (email) return userService.getUserByEmail(email);
        if (id) return userService.getUserById(id);
        return userService.getAllUser();
      })
      .post("/", ({ body, set }: { body: User; set: { status: number } }) =>
        userService
          .postUser(body)
          .then((data) => {
            if (data.status === StatusCodes.CONFLICT) {
              set.status = StatusCodes.CONFLICT;
              return data;
            }
            set.status = StatusCodes.CREATED;
            return data;
          })
          .catch((e) => e)
      )
  );

import { StatusCodes } from "http-status-codes";
import { usersRepo } from "./user.repo";
import { User } from "@prisma/client";
import Elysia, { StatusMap } from "elysia";
import { ElysiaErrors } from "elysia/dist/error";

export const userService = {
  getAllUser: () =>
    usersRepo()
      .findMany()
      .then((res) =>
        !res
          ? { message: "User not found", status: StatusCodes.NOT_FOUND }
          : { message: "success", status: StatusCodes.OK, data: res }
      )
      .catch((_) => ({
        message: "Internal server error",
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      })),

  getUserById: (id: string) =>
    usersRepo()
      .findUserById(id)
      .then((res) =>
        !res
          ? { message: "User not found", status: StatusCodes.NOT_FOUND }
          : { message: "success", status: StatusCodes.OK, data: res }
      )
      .catch((err) => ({
        message: "Internal server error",
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      })),

  getUserByEmail: (email: string) =>
    usersRepo()
      .findUserByEmail(email)
      .then((res) =>
        !res
          ? { message: "User not found", status: StatusCodes.NOT_FOUND }
          : { message: "success", status: StatusCodes.OK, data: res }
      )
      .catch((_) => ({
        message: "Internal server error",
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      })),

  postUser: async (data: User) => {
    try {
      const res = await usersRepo().findUserByEmail(data.email);
      if (res) {
        return {
          message: "User already exist",
          status: StatusCodes.CONFLICT,
        };
      }
      const res2 = await usersRepo().createUser(data);
      return {
        message: "success",
        status: StatusCodes.CREATED,
        data: { res2 },
      };
    } catch (error) {
      return {
        message: "Internal server error",
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      };
    }
  },
};

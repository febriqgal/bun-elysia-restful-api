import { User } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { usersRepo } from "./user.repo";

export const userService = {
  getAll: () =>
    usersRepo
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

  getById: (id: string) =>
    usersRepo
      .findById(id)
      .then((res) =>
        !res
          ? {
              message: "User not found",
              status: StatusCodes.NOT_FOUND,
              data: res,
            }
          : { message: "success", status: StatusCodes.OK, data: res }
      )

      .catch((err) => ({
        message: "Internal server error",
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        data: null,
      })),

  getByEmail: (email: string) =>
    usersRepo
      .findByEmail(email)
      .then((res) =>
        !res
          ? { message: "User not found", status: StatusCodes.NOT_FOUND }
          : { message: "success", status: StatusCodes.OK, data: res }
      )
      .catch((_) => ({
        message: "Internal server error",
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      })),

  post: async (data: User) => {
    try {
      const res = await usersRepo.findByEmail(data.email);
      if (res) {
        return {
          message: "User already exist",
          status: StatusCodes.CONFLICT,
        };
      }
      const res2 = await usersRepo.create(data);
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

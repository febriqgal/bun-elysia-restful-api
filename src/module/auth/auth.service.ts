import { StatusCodes } from "http-status-codes";
import { authRepo } from "./auth.repo";

export const authService = {
  getAllUser: async () => {
    const res = await authRepo().findMany();
    try {
      return { message: "success", status: StatusCodes.OK, data: res };
    } catch (error) {
      return {
        message: "Internal server error",
        status: StatusCodes.BAD_REQUEST,
      };
    }
  },

  getUserByEmail: async (id: string) => {
    const res = await authRepo().findByEmail(id);
    try {
      return { message: "success", status: StatusCodes.OK, data: res };
    } catch (error) {
      return {
        message: "Internal server error",
        status: StatusCodes.BAD_REQUEST,
      };
    }
  },
};

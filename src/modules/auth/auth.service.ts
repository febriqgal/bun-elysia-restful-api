import { StatusCodes } from "http-status-codes";
import { authRepo } from "./auth.repo";
import { Token } from "@prisma/client";

export const authService = {
  getAll: async () => {
    const res = await authRepo.findMany();
    try {
      return { message: "success", status: StatusCodes.OK, data: res };
    } catch (error) {
      return {
        message: "Internal server error",
        status: StatusCodes.BAD_REQUEST,
      };
    }
  },

  getById: async (id: string) => {
    const res = await authRepo.findById(id);
    try {
      return { message: "success", status: StatusCodes.OK, data: res };
    } catch (error) {
      return {
        message: "Internal server error",
        status: StatusCodes.BAD_REQUEST,
      };
    }
  },
  createRefreshToken: async (id: string, createRefreshToken: string) => {
    const res = await authRepo.createRefreshToken(id, createRefreshToken);
    try {
      return { message: "created success", status: StatusCodes.OK, data: res };
    } catch (error) {
      return {
        message: "Internal server error",
        status: StatusCodes.BAD_REQUEST,
      };
    }
  },
  updateRefreshToken: async (id: string, refreshToken: string) => {
    const res = await authRepo.updateRefreshToken(id, refreshToken);
    try {
      return { message: "updated success", status: StatusCodes.OK, data: res };
    } catch (error) {
      return {
        message: "Internal server error",
        status: StatusCodes.BAD_REQUEST,
      };
    }
  },
  createAccessToken: async (id: string, createAccessToken: string) => {
    const res = await authRepo.createAccessToken(id, createAccessToken);
    try {
      return { message: "created success", status: StatusCodes.OK, data: res };
    } catch (error) {
      return {
        message: "Internal server error",
        status: StatusCodes.BAD_REQUEST,
      };
    }
  },
  updateAccessToken: async (id: string, AccessToken: string) => {
    const res = await authRepo.updateAccessToken(id, AccessToken);
    try {
      return { message: "updated success", status: StatusCodes.OK, data: res };
    } catch (error) {
      return {
        message: "Internal server error",
        status: StatusCodes.BAD_REQUEST,
      };
    }
  },
};

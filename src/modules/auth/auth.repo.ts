import { prisma } from "../../constants/data.connection";

export const authRepo = {
  findMany: () => prisma.token.findMany({}),
  findById: (id: string) => prisma.token.findUnique({ where: { user_id: id } }),
  createRefreshToken: (id: string, refresh_token: string) =>
    prisma.token.create({
      data: {
        refresh_token: refresh_token,
        user_id: id,
      },
    }),
  updateRefreshToken: (id: string, refresh_token: string) =>
    prisma.token.update({
      where: { user_id: id },
      data: { refresh_token: refresh_token },
    }),
  createAccessToken: (id: string, access_token: string) =>
    prisma.token.create({
      data: {
        access_token: access_token,
        user_id: id,
      },
    }),
  updateAccessToken: (id: string, access_token: string) =>
    prisma.token.update({
      where: { user_id: id },
      data: { access_token: access_token },
    }),
};

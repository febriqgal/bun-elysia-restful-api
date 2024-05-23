import { User } from "@prisma/client";
import { prisma } from "../../constants/data.connection";

export const usersRepo = {
  findMany: () => prisma.user.findMany({ include: { token: true } }),
  findById: (id: string) =>
    prisma.user.findUnique({ where: { id }, include: { token: true } }),
  findByEmail: (email: string) => prisma.user.findUnique({ where: { email } }),
  create: async (data: User) =>
    prisma.user.create({
      data: {
        ...data,
        email: data.email.toLowerCase(),
        password: await Bun.password.hash(data.password),
      },
    }),
};

// export type UsersRepository = ReturnType<typeof usersRepo>;

import { User } from "@prisma/client";
import { prisma } from "../../lib/db";

export const usersRepo = () => ({
  findMany: () => prisma.user.findMany(),

  findUserById: (id: string) => prisma.user.findUnique({ where: { id: id } }),

  findUserByEmail: (email: string) =>
    prisma.user.findUnique({ where: { email: email } }),

  createUser: async (data: User) =>
    prisma.user.create({
      data: {
        ...data,
        email: data.email.toLowerCase(),
        password: await Bun.password.hash(data.password),
      },
    }),
});

// export type UsersRepository = ReturnType<typeof usersRepo>;

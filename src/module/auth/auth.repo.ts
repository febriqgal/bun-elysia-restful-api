import { prisma } from "../../lib/db";

export const authRepo = () => ({
  findMany: () => {
    return prisma.account.findMany({});
  },
  findByEmail: (id: string) => {
    return prisma.account.findUnique({ where: { user_id: id } });
  },
});

// export type UsersRepository = ReturnType<typeof usersRepo>;

import { env } from "bun";

export const AppConfig = {
  PORT: Number(env.PORT),
  HOST: env.HOST,
};

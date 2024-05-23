import { bearer } from "@elysiajs/bearer";
import swagger from "@elysiajs/swagger";
import chalk from "chalk";
import Elysia, { redirect } from "elysia";
import { AppConfig } from "./constants/app.config";
import {
  authController,
  baseController,
  userController,
} from "./modules/route";

new Elysia()
  .get("/", () => redirect("/api/v1/docs"))
  .group("/api", (api) =>
    api.group("/v1", (v1) =>
      v1
        .use(swagger({ path: "/docs" }))
        .use(authController)
        .use(userController)
        .use(baseController)
    )
  )
  .onError(({ code }) => code === "NOT_FOUND" && "Route not found :(")
  .listen(AppConfig.PORT, () =>
    console.log(
      chalk.green(
        `Server menyalaa abangkuh🔥 di ${AppConfig.HOST}${AppConfig.PORT}`
      )
    )
  );

import { bearer } from "@elysiajs/bearer";
import swagger from "@elysiajs/swagger";
import Elysia from "elysia";
import { AppConfig } from "./constant/AppConfig";
import { authController, baseController, userController } from "./module";

new Elysia()
  .use(bearer())
  .use(swagger())
  .group("/api", (api) =>
    api.group("/v1", (v1) =>
      v1.use(authController).use(userController).use(baseController)
    )
  )
  .onError(({ code }) => code === "NOT_FOUND" && "Route not found :(")
  .listen(AppConfig.PORT, () =>
    console.log(`🔥 Server running on ${AppConfig.HOST}${AppConfig.PORT}`)
  );

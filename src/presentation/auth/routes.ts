import { Router } from "express";
import { AuthController } from "./controller";
import { AuthDataSourceImpl, AuthRepositoryImp } from "../../infrastructure";
import { AuthMiddleware } from "../middlewares/auth.middleware";

export class AuthRoutes {
    static get routes(): Router {
        const router = Router()
        const datasource = new AuthDataSourceImpl()
        const authRepository = new AuthRepositoryImp(datasource)
        const controller = new AuthController(authRepository)

        router.post("/login", controller.loginUser)

        router.post("/register", controller.registerUser)
        router.get("/",[AuthMiddleware.validateJwt ], controller.getUsers)
        return router
    }
}
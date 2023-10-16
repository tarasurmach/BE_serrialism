import "./auth.controller.js";
import {ContainerModule} from "inversify"


import {AuthService} from "./auth.service.js";
import {Auth_TYPES, User_TYPES} from "../utils/types/injection_types.js";
import UserModel from "../resources/user/user.model.js";
import {UserRepository} from "../resources/user/user.repository.js";

export const authContainer = new ContainerModule(bind => {
    bind<UserRepository>(User_TYPES.UserRepository).toConstantValue(new UserRepository(UserModel));
    bind<AuthService>(Auth_TYPES.AuthService).to(AuthService).inSingletonScope();
})
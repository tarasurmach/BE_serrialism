import {inject, injectable} from "inversify";
import { User_TYPES} from "../utils/types/injection_types.js";
import {UserRepository} from "../resources/user/user.repository.js";

import User from "../resources/user/user.interface.js";
import HttpException from "../utils/exceptions/http.exception.js";
import {compare, hash} from "bcrypt"
import {sign, verify} from "../utils/helpers/jwt.helper.js";
import {SignIn} from "./auth.controller.js";

@injectable()
export class AuthService {
    constructor(@inject(User_TYPES.UserRepository) private readonly repository:UserRepository) {
    }

    async login({login:input, password, type}:SignIn) {
        if(!input || !password) {
            throw new HttpException("Both login and password are mandatory", 400)
        }
        const result = await this.repository.findOne({[type]:input});
        if(!result) {
            throw new HttpException(`User with such ${type} doesn't exist`, 400)
        }
        const isMatch = await compare(password, result.password);
        if(!isMatch) {
            throw new HttpException("Incorrect password", 401)
        }
        return {tokens:sign({_id:result._id, username:result.username}), result};

    }

    async signUp({username, password, email, password2}:Pick<User, "password"|"username"|"email">&{password2:string}) {
        if(password !== password2) {
            throw new HttpException("Passwords don't match", 400)
        }
        const userExists  = await this.repository.findOne({$or:[{username}, {email}]});
        if(userExists) {
            const field = username === userExists.username ? "username" : "email";
            throw new HttpException(`User with such ${field} already exists`, 409);
        }
        const hashedPw = await hash(password, 10);
        const result = await this.repository.create({username, email, password:hashedPw});
        return {tokens:sign({_id:result._id, username:result.username}), result};
    }
    async refresh(token:string) {
        if(!token) throw new HttpException("No token provided", 400 );
        const decodedPayload = verify(token);
        if(!decodedPayload) throw new HttpException("Unauthorized", 403);
        const foundUser = await this.repository.findOne({username:decodedPayload.username});
        if(!foundUser) throw new HttpException("User not found", 404);
        const [accessToken] = sign({username:foundUser.username,_id:foundUser._id })
        return {accessToken, userId:foundUser._id, username:foundUser.username, imgUrl:foundUser.imgUrl}
    }
}


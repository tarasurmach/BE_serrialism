import {controller, httpGet, httpPost} from "inversify-express-utils";
import {inject} from "inversify";
import {NextFunction, Request, Response} from "express";
import {tryCatch} from "../utils/decoratorTest.js";
import {Auth_TYPES} from "../utils/types/injection_types.js";
import {AuthService} from "./auth.service.js";
import validationMiddleware from "../middleware/validation.middleware.js";
import {login, register} from "./auth.validation.js";

export interface SignIn {
    login:string,
    password:string,
    type:"email"|"username"
}
interface SignUp {
    username:string,
    email:string,
    password:string,
    password2:string
}


@controller("/auth")
export class AuthController {
    constructor(@inject(Auth_TYPES.AuthService) private readonly service:AuthService) {
    }
    @tryCatch
    @httpPost("/signIn", /*validationMiddleware(login),*/ determineLoginType)
    private async signIn(req:Express.TypedRequestBody<SignIn>, res: Response):Promise<Response|void> {
        console.log("what")
        const {tokens, result:user} = await this.service.login(req.body);
        const [accessToken, refreshToken] = tokens
        res.status(200)
            //.cookie(refreshToken, {httpOnly:true, sameSite:"lax", maxAge:7*24*60*1000})
            .json({token:accessToken, username:user.username, userId:user._id})
    }
    @tryCatch
    @httpPost("/signup", validationMiddleware(register))
    private async signUp(req:Express.TypedRequestBody<SignUp>, res:Response, next:NextFunction):Promise<Response|void> {
        try {
            console.log("what")
            const {tokens, result:{username, _id}} = await this.service.signUp(req.body);
            const [accessToken, refreshToken] = tokens;
            res.status(200)
                .cookie(refreshToken, {httpOnly:true, sameSite:"lax", maxAge:7*24*60*1000})
                .json({token:accessToken, username:username, userId:_id})
        }catch (e) {
            next(e)
        }
    }
    @tryCatch
    @httpGet("/logout")
    private async logout(req:Request, res:Response, next:NextFunction):Promise<Response|void> {
        res.clearCookie("jwt", {httpOnly:true, sameSite:"lax"})
            .status(200).json({ message: "Logged out successfully" })
            .json({ message: "Logged out successfully" });
    }
    @tryCatch
    @httpPost("/refresh")
    private async refresh(req:Request, res:Response, next:NextFunction):Promise<Response|void> {
        const token = req.cookies.jwt;
        const refreshResult = await this.service.refresh(token)
        res.status(201).json(refreshResult)


    }

}

function determineLoginType (req:Express.TypedRequestBody<SignIn>, res:Response, next:NextFunction):void {
    req.body.type  = (req.body.login as string).indexOf("@") > -1 ? "email" : "username";
    return next()
}

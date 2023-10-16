import User from "resources/user/user.interface.js";
import jwt, {JwtPayload, VerifyErrors} from "jsonwebtoken"
import HttpException from "../exceptions/http.exception.js";
import {UserRepository} from "../../resources/user/user.repository.js";
import {Types} from "mongoose";
interface IPayload {
    username:string,

}
export function sign({_id, username}:Pick<User, "_id"|"username">):string[] {
    console.log(arguments);
    console.log("Env", process.env.ACCESS)
    const accessToken = jwt.sign(
        {
        username,
        userId:_id
    },
        process.env.ACCESS as string,
        {expiresIn:"30m"}
    )
    const refreshToken = jwt.sign({
        username
    },
        process.env.REFRESH as string,
        {expiresIn:"1h"}
        )
    return [accessToken, refreshToken]
}
export function verify(token:string):JwtPayload&IPayload  {
    return jwt.verify(token, process.env.REFRESH as string, {complete:false}) as JwtPayload&IPayload;

}
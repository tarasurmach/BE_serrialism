import HttpException from "../exceptions/http.exception.js";


export async function promiseWrapper<T>(promise:Promise<T>, errorMsg:string="An error occurred", statusCode:number=500):Promise<T|void> {
    const result = promise.catch(e=>{
        console.log("Exception: " + e.message);
        throw new HttpException(errorMsg ?? e.message, statusCode)
    })
    return result;


}
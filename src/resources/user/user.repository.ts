import {injectable} from "inversify";
import {MongoRepository} from "../../utils/repositories/base.repository.js";
import User from "./user.interface.js";
import {Model} from "mongoose";

@injectable()
export class UserRepository extends MongoRepository<{}, User>{
    constructor(private readonly userModel:Model<User>) {
        super(userModel);
        
    }
}
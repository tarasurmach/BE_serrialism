import {injectable} from "inversify";
import {MongoRepository} from "../../utils/repositories/base.repository.js";
import {ITag} from "./tag.interface.js";
import {Model, Types} from "mongoose";

@injectable()
export class TagRepository extends MongoRepository<ITag>{
    constructor(private tagModel:Model<ITag>) {
        super(tagModel)
    }
    public async getOldTags(tags:Types.ObjectId[]) {
        return this.tagModel.find({_id:{$in:tags}})
    }
    public async removeOldTags(tags:Types.ObjectId[], item:string) {
        return Promise.all(tags.map(async tag=> this.tagModel.findByIdAndUpdate(tag, {$pull:{item}}, {new:true})))
    }
}
import {inject, injectable} from "inversify";
import {TagRepository} from "./tag.repository.js";
import {Tag_Types} from "../../utils/types/injection_types.js";
import  {ObjectId, Types} from "mongoose";
import {ITag} from "./tag.interface.js";



interface PostTags {
    userId:string,
    body:{
        item:string,
        type:"Review"|"List",
        tags:string[]
    },

}

type ModelType = "Review"|"List";
@injectable()
export class TagService {
    constructor(@inject(Tag_Types.TagRepository) private readonly tagRepo:TagRepository) {
    }
    public async postTags(userId:string, item:string, type:ModelType, tags:string[]):Promise<Types.ObjectId[]> {

        console.log("AAAAAAAAAAAA"+ tags)
        const tagsResult = await this.handleTags(tags, type, userId, item);
        console.log("Tags result: "+tagsResult)

        return  tagsResult;

    }
    public async putTags(userId:string, item:string, type:ModelType, tags:string[]):Promise<Types.ObjectId[]> {
        return  this.handleTags(tags, type, userId, item);

    }
    public async handleOldTags(oldTagIds:Types.ObjectId[], item:string):Promise<Awaited<ITag[]>> {
        /*const oldTags = await this.tagRepo.getOldTags(oldTagIds);
        const tagsToRemove = oldTags.filter(oldTag=> !tags.includes(oldTag.tag))
        console.log("Old tags: "+oldTags);
        console.log("Tags to remove: "+tagsToRemove);
        if(tagsToRemove.length>0) {
            await this.tagRepo.removeOldTags(tagsToRemove.map(tag=> tag._id), item)
        }*/
        return (await this.tagRepo.removeOldTags(oldTagIds, item) as unknown) as Promise<Awaited<ITag[]>>
    }

    public async handleTags(tags:string[], model:ModelType, userId:string, item:string):Promise<Types.ObjectId[]> {
        console.log("Tags in: "+tags)
        const result = await Promise.all(tags.map(async tag=>{
            const tagExists = await this.tagRepo.exists({$and:[{tag:tag}, {type:model}]});
            return (tagExists ?
                 this.tagRepo.findAndUpdate({tag:tag, type:model}, {$addToSet:{user:userId,item }}) :
                 this.tagRepo.create({tag, item:[((item as unknown) as ObjectId)], user:[((userId as unknown) as ObjectId)], type:model}));

        })) as ITag[]
        return result.map(tag=> tag._id);

    }
    public async handleTagDifference(oldTagIds:Types.ObjectId[], newTags:string[]):Promise<ITag[]> {
        const oldTags = await this.tagRepo.getOldTags(oldTagIds);
        return oldTags.filter(oldTag=> !newTags.includes(oldTag.tag))
    }

}


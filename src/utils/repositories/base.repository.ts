import mongoose, {
    Model,
    Document,
    SortOrder,
    UpdateQuery,
    Types,
    PopulateOptions, FilterQuery
} from 'mongoose';
import HttpException from "../exceptions/http.exception.js";
interface Options<Doc extends Document> {
    sortType?: any;
    sortOrder?: SortOrder;
    limit?: number;
    skip?: number;
}
interface Reader<T, F extends Document> {
    find: (query: T, options?: Options<F>) => Promise<F[]>;
    findById: (query: string) => Promise<F | null>;
    exists: (query: T) => Promise<boolean>;
    findOne: (query: T) => Promise<F | null>;
}

interface Writer<T, F extends Document> {
    create: (body: Partial<F>) => Promise<Document<F> | null>;
    update: (body: Partial<F>) => Promise<Document<F> | null>;
    delete: (query: T) => Promise<Document<F> | null>;
}
export type BaseRepository<T, F extends Document> = Writer<T, F> & Reader<T, F>;
export abstract class MongoRepository<F extends Document, T extends Object = FilterQuery<F>>
    implements BaseRepository<T, F>
{
    //private Model: Model<F>;

    protected constructor(private  model:Model<F>) {
        //this.Model = mongoose.model<F>(model);
    }
    find(query: T, options?: Options<F>): Promise<F[]> {
        let res = this.model.find(query);
        if (!options) {
            return res;
        }
        if (options.sortType && options.sortOrder) {
            res = res.sort({
                [options.sortType]: options.sortOrder,
            });
        }
        if (options.skip) {
            res = res.skip(options.skip);
        }
        if (options.limit) {
            res = res.limit(options.limit);
        }
        return res;
    }
    findById(query: string): Promise<F | null> {
        return this.model.findById(query);
    }
    async exists(query: T): Promise<boolean> {
        const res = await this.model.findOne(query);
        return !!res;
    }
    findOne(query: T): Promise<F | null> {
        return this.model.findOne(query);
    }
    countDocuments(query: T): Promise<number> {
        return this.model.countDocuments(query);
    }
    create(body: Partial<F>):Promise<F> {
        return this.model.create(body)
    }
    update(body: Partial<F>) {
        return  this.model.findByIdAndUpdate(body._id, body, {
            new: true,
        });
    }
    delete(query: T) {
        return this.model.findOneAndDelete(query);
    }
    findAndUpdate(query:T, update:UpdateQuery<F>) {
        return this.model.findOneAndUpdate(query, update)
    }
    findByIdAndUpdate(query:Types.ObjectId, update:UpdateQuery<F>) {
        return this.model.findByIdAndUpdate(query, update, {new:true})
    }
    findByIdAndDelete(id:string|Types.ObjectId) {
        return this.model.findByIdAndDelete(id)
    }
    async findAndPopulate(query:T, option:(PopulateOptions|PopulateOptions[])) {
        const docs = await this.model.find(query);
        if(!docs) return;
        return Promise.all(docs.map(doc=> doc.populate(option)))
    }
    async queryDynamicModel<Doc>(model:string, query:FilterQuery<Doc>):Promise<(Doc|null)[]> {
        const Model = mongoose.model(model);
        if(!Model) throw new HttpException(`Model ${model} doesn't exist`, 400);
        return Model.find(query);
    }
    async deleteMany(query:T) {
        this.model.deleteMany(query)
    }
    async paginate(paginationObj:Options<F>& {limit:number, filter:T,  page:number} ) {
        const {page=1, filter, limit=10, sortType, sortOrder} = paginationObj;
        const startIndex = (+page -1)*limit;
        const totalCount = await this.model.countDocuments(filter);
        const result = await this.find(paginationObj.filter, {skip:startIndex, sortOrder, sortType, limit});
        return {
            result,
            currentPage: +page,
            numberOfPages: Math.ceil(totalCount / limit)
        };
    }
}

//const mongo = new MongoRepository<Record<any, any>, User>('User');

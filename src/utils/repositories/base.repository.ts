import mongoose, {
    Mongoose,
    Model,
    Document,
    SortOrder,
    PopulateOption,
    Query,
    UpdateQuery,
    Types,
    PopulateOptions
} from 'mongoose';
interface Options {
    sortType?: string;
    sortOrder?: SortOrder;
    limit?: number;
    skip?: number;
}
interface Reader<T, F extends Document> {
    find: (query: T, options?: Options) => Promise<F[]>;
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
export abstract class MongoRepository<T extends object, F extends Document>
    implements BaseRepository<T, F>
{
    //private Model: Model<F>;

    protected constructor(private  model:Model<F>) {
        //this.Model = mongoose.model<F>(model);
    }
    find(query: T, options?: Options): Promise<F[]> {
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
    create(body: Partial<F>) {
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
        return this.model.findByIdAndUpdate(query, update)
    }
    findByIdAndDelete(id:string|Types.ObjectId) {
        return this.model.findByIdAndDelete(id)
    }
    async findAndPopulate(query:T, option:(PopulateOptions|string)[]) {
        const doc = await this.model.findOne(query);
        if(!doc) return;
        return doc.populate(option)
    }
}

//const mongo = new MongoRepository<Record<any, any>, User>('User');

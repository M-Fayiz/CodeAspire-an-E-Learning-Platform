import {
  Document,
  Model,
  Types,
  FilterQuery,
  UpdateQuery,
  PopulateOptions,
  ModifyResult,
} from "mongoose";
type PopulateFieldType =
  | string
  | PopulateOptions
  | Array<string | PopulateOptions>;

export abstract class BaseRepository<T extends Document> {
  constructor(protected model: Model<T>) {}

  async findAll(populateFields?: PopulateFieldType): Promise<T[]> {
    let query = this.model.find();

    if (populateFields) {
      if (Array.isArray(populateFields)) {
        query = query.populate(populateFields);
      }
    }

    return query.exec();
  }
  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne(filter);
  }
  async create(data: Partial<T>): Promise<T> {
    const document = new this.model(data);
    return document.save();
  }
  async findById(id: Types.ObjectId,populateFields?:PopulateFieldType): Promise<T | null> {
    let query= this.model.findById(id);
    if (populateFields) {
      if (Array.isArray(populateFields)) {
        query = query.populate(populateFields);
      }
    }
    return query.exec()
  }
  async findUserByEmail(email: string): Promise<T | null> {
    return this.model.findOne({ email });
  }
  async find(filter:FilterQuery<T>,populateFields?:PopulateFieldType):Promise<T[]|null>{
    let query=this.model.find(filter)
    if(populateFields){
      if(Array.isArray(populateFields)){
        query=query.populate(populateFields)
      }
    }
    return query.exec()
  }
  async findUserAndUpdate(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>,
    options = { new: true },
  ): Promise<T | null> {
    return this.model.findOneAndUpdate(filter, update, options);
  }
  async findByIDAndUpdate(
    id: Types.ObjectId,
    update: UpdateQuery<T>,
  ): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, update, {
      upsert: true,
      new: true,
    });
  }
  async findBySlugAndUpdate(
    slug: string,
    update: UpdateQuery<T>,
  ): Promise<T | null> {
    return this.model.findOneAndUpdate(
      { slug: slug },
      { $set: update },
      { new: true },
    );
  }
  async PushToArray(
    filter: FilterQuery<T>,
    arrayPath: string,
    elements: any,
  ): Promise<T | null> {
    const update: UpdateQuery<T> = { $push: { [arrayPath]: elements } } as any;
    return this.model
      .findOneAndUpdate(filter, update, { new: true })
      .lean<T>()
      .exec();
  }
}

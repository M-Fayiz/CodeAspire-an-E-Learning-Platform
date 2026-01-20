import {
  Document,
  Model,
  Types,
  FilterQuery,
  UpdateQuery,
  PopulateOptions,
  QueryOptions,
  PipelineStage,
} from "mongoose";

type PopulateFieldType =
  | string
  | PopulateOptions
  | Array<string | PopulateOptions>;

type ArrayKeys<T> = {
  [K in keyof T]-?: NonNullable<T[K]> extends any[] ? K : never;
}[keyof T];



export abstract class BaseRepository<T extends Document> {
  constructor(protected model: Model<T>) {}

  async findAll<F = T>(
    filter?: FilterQuery<T>,
    limit?: number,
    skip?: number,
    populateFields?: PopulateFieldType,
    desSort?: boolean,
  ): Promise<F[]> {
    let query = this.model.find(filter || {}).lean<F>();

    if (limit !== undefined) query = query.limit(limit);
    if (skip !== undefined) query = query.skip(skip);
    if (populateFields && Array.isArray(populateFields))
      query = query.populate(populateFields);

    query = query.sort({ createdAt: desSort ? -1 : 1 });

    return query.exec() as unknown as F[];
  }

  async countDocuments(filter?: FilterQuery<T>): Promise<number> {
    return this.model.countDocuments(filter || {}).exec();
  }

  async findOne<M = T>(
    filter: FilterQuery<T>,
    populateFields?: PopulateFieldType,
  ): Promise<M | null> {
    let query = this.model.findOne(filter).lean<M>();
    if (populateFields) {
      if (Array.isArray(populateFields)) {
        query = query.populate(populateFields);
      }
    }
    return query.exec();
  }
  async create(data: Partial<T>): Promise<T> {
    const document = new this.model(data);
    return document.save();
  }
  async findById(
    id: Types.ObjectId,
    populateFields?: PopulateFieldType,
  ): Promise<T | null> {
    let query = this.model.findById(id);
    if (populateFields) {
      if (Array.isArray(populateFields)) {
        query = query.populate(populateFields);
      }
    }
    return query.exec();
  }
  async findUserByEmail(email: string): Promise<T | null> {
    return this.model.findOne({ email });
  }
  async find<U = T>(
    filter: FilterQuery<T>,
    populateFields?: PopulateFieldType,
  ): Promise<U[] | null> {
    let query = this.model.find(filter);
    if (populateFields && Array.isArray(populateFields)) {
      query = query.populate(populateFields);
    }
    return query.lean().exec() as Promise<U[]>;
  }

  async findUserAndUpdate(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>,
    options = { new: true },
  ): Promise<T | null> {
    return this.model.findOneAndUpdate(filter, update, options);
  }
  async findByIDAndUpdate<F = T>(
    id: Types.ObjectId,
    update: UpdateQuery<T>,
  ): Promise<F | null> {
    return this.model.findByIdAndUpdate(id, update, {
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
 async pushToArray<K extends ArrayKeys<T>>(
  filter: FilterQuery<T>,
  arrayPath: K,
  element: NonNullable<T[K]> extends Array<infer U> ? U : never,
): Promise<T | null> {
  return this.model.findOneAndUpdate(
    filter,
    { $push: { [arrayPath]: element } } as UpdateQuery<T>,
    { new: true }
  ).lean<T>().exec();
}


  async findItemAndUpdate(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>,
    options: QueryOptions = { new: true },
  ): Promise<T | null> {
    return this.model.findOneAndUpdate(filter, update, options);
  }
  async addToSet<K extends ArrayKeys<T>>(
  filter: FilterQuery<T>,
  arrayPath: K,
  element: T[K] extends Array<infer U> ? U : never,
): Promise<T | null> {
  return this.model.findOneAndUpdate(
    filter,
    { $addToSet: { [arrayPath]: element } } as UpdateQuery<T>,
    { new: true }
  ).lean<T>().exec();
}

  async aggregate<R = T>(pipeline: PipelineStage[]): Promise<R[]> {
    return this.model.aggregate(pipeline).exec();
  }
  async UpdateMany(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>,
  ): Promise<T[]> {
    this.model.updateMany(filter, update);

    return this.model.find(filter);
  }
  async findOneAndUpdate(
    filter: FilterQuery<T>,
    updateData: UpdateQuery<T>,
  ): Promise<T | null> {
    return this.model
      .findOneAndUpdate(filter, updateData, { new: true })
      .lean<T>();
  }

async pullFromArray<K extends ArrayKeys<T>>(
  filter: FilterQuery<T>,
  arrayPath: K,
  match: Partial<
    NonNullable<T[K]> extends Array<infer U> ? U : never
  >,
): Promise<T | null> {
  return this.model.findOneAndUpdate(
    filter,
    { $pull: { [arrayPath]: match } } as UpdateQuery<T>,
    { new: true }
  ).lean<T>().exec();
}


  async findByIDAndUpdateProfile<F = T>(
    id: Types.ObjectId,
    update: Partial<T>,
  ): Promise<F | null> {
    return this.model.findByIdAndUpdate(
      id,
      { $set: update },
      {
        new: true,
        runValidators: true,
      },
    );
  }
}

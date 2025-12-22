"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
class BaseRepository {
    constructor(model) {
        this.model = model;
    }
    async findAll(filter, limit, skip, populateFields, desSort) {
        let query = this.model.find(filter || {}).lean();
        if (limit !== undefined)
            query = query.limit(limit);
        if (skip !== undefined)
            query = query.skip(skip);
        if (populateFields && Array.isArray(populateFields))
            query = query.populate(populateFields);
        query = query.sort({ createdAt: desSort ? -1 : 1 });
        return query.exec();
    }
    async countDocuments(filter) {
        return this.model.countDocuments(filter || {}).exec();
    }
    async findOne(filter, populateFields) {
        let query = this.model.findOne(filter).lean();
        if (populateFields) {
            if (Array.isArray(populateFields)) {
                query = query.populate(populateFields);
            }
        }
        return query.exec();
    }
    async create(data) {
        const document = new this.model(data);
        return document.save();
    }
    async findById(id, populateFields) {
        let query = this.model.findById(id);
        if (populateFields) {
            if (Array.isArray(populateFields)) {
                query = query.populate(populateFields);
            }
        }
        return query.exec();
    }
    async findUserByEmail(email) {
        return this.model.findOne({ email });
    }
    async find(filter, populateFields) {
        let query = this.model.find(filter);
        if (populateFields && Array.isArray(populateFields)) {
            query = query.populate(populateFields);
        }
        return query.lean().exec();
    }
    async findUserAndUpdate(filter, update, options = { new: true }) {
        return this.model.findOneAndUpdate(filter, update, options);
    }
    async findByIDAndUpdate(id, update) {
        return this.model.findByIdAndUpdate(id, update, {
            new: true,
        });
    }
    async findBySlugAndUpdate(slug, update) {
        return this.model.findOneAndUpdate({ slug: slug }, { $set: update }, { new: true });
    }
    async PushToArray(filter, arrayPath, elements) {
        const update = { $push: { [arrayPath]: elements } };
        return this.model
            .findOneAndUpdate(filter, update, { new: true })
            .lean()
            .exec();
    }
    async findItemAndUpdate(filter, update, options = { new: true }) {
        return this.model.findOneAndUpdate(filter, update, options);
    }
    async addTOSet(filter, arrayPath, elements) {
        const update = {
            $addToSet: { [arrayPath]: elements },
        };
        return this.model
            .findOneAndUpdate(filter, update, { new: true })
            .lean()
            .exec();
    }
    async aggregate(pipeline) {
        return this.model.aggregate(pipeline).exec();
    }
    async UpdateMany(filter, update) {
        this.model.updateMany(filter, update);
        return this.model.find(filter);
    }
    async findOneAndUpdate(filter, updateData) {
        return this.model
            .findOneAndUpdate(filter, updateData, { new: true })
            .lean();
    }
    async pullItemFromArray(filter, arrayPath, itemId) {
        const result = await this.model.findOneAndUpdate(filter, {
            $pull: {
                [arrayPath]: { _id: itemId },
            },
        }, { new: true });
        return result ?? null;
    }
}
exports.BaseRepository = BaseRepository;

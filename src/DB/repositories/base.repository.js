
class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    return await this.model.create(data);
  }

  async insertMany(data) {
    return await this.model.insertMany(data);
  }

  async find({
    filter = {},
    select = "",
    populate = [],
    sort = {},
    skip = 0,
    limit,
    lean = false,
  } = {}) {
    let query = this.model.find(filter).select(select).sort(sort).skip(skip);

    if (limit) query.limit(limit);

    if (populate.length) {
      populate.forEach((item) => query.populate(item));
    }

    if (lean) query.lean();

    return await query;
  }

  async findOne({
    filter = {},
    select = "",
    populate = [],
    lean = false,
  } = {}) {
    let query = this.model.findOne(filter).select(select);

    if (populate.length) {
      populate.forEach((item) => query.populate(item));
    }

    if (lean) query.lean();

    return await query;
  }

  async findById({
    id,
    select = "",
    populate = [],
    lean = false,
  }) {
    let query = this.model.findById(id).select(select);

    if (populate.length) {
      populate.forEach((item) => query.populate(item));
    }

    if (lean) query.lean();

    return await query;
  }

  async updateOne({
    filter = {},
    update = {},
    options = {},
  }) {
    return await this.model.updateOne(filter, update, options);
  }

  async updateMany({
    filter = {},
    update = {},
    options = {},
  }) {
    return await this.model.updateMany(filter, update, options);
  }

  async findOneAndUpdate({
    filter = {},
    update = {},
    options = {},
  }) {
    return await this.model.findOneAndUpdate(filter, update, {
      new: true,
      runValidators: true,
      ...options,
    });
  }

  async findByIdAndUpdate({
    id,
    update = {},
    options = {},
  }) {
    return await this.model.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
      ...options,
    });
  }

  async deleteOne(filter = {}) {
    return await this.model.deleteOne(filter);
  }

  async deleteMany(filter = {}) {
    return await this.model.deleteMany(filter);
  }

  async findOneAndDelete(filter = {}) {
    return await this.model.findOneAndDelete(filter);
  }

  async findByIdAndDelete(id) {
    return await this.model.findByIdAndDelete(id);
  }

  async countDocuments(filter = {}) {
    return await this.model.countDocuments(filter);
  }

  async exists(filter = {}) {
    return await this.model.exists(filter);
  }
}

export default BaseRepository;

export const create = async ({ model, data } = {}) => {
  return await model.create(data);
};

export const find = async ({ model, filter = {}, options = {} } = {}) => {
  const doc = model.find(filter);
  if (options.select) {
    doc.select(options.select);
  }
  if (options.skip) {
    doc.skip(options.skip);
  }
  if (options.limit) {
    doc.limit(options.limit);
  }
  if(options.sort){
    doc.sort(options.sort)
  }
  if (options.populate) {
    doc.populate(options.populate);
  }
  return await doc.exec();
};

export const findOne = async ({ model, filter = {}, options = {} } = {}) => {
  const doc = model.findOne(filter);
  if (options.select) {
    doc.select(options.select);
  }
  if (options.populate) {
    doc.populate(options.populate);
  }
  return await doc.exec();
};

export const findById = async ({ model, id, options = {} } = {}) => {
  const doc = model.findById(id);
  if (options.select) {
    doc.select(options.select);
  }
  if (options.populate) {
    doc.populate(options.populate);
  }
  return await doc.exec();
};

export const updateOne = async ({
  model,
  filter = {},
  update = {},
  options = {},
} = {}) => {
  return await model.updateOne(filter, update, {
    runValidators: true,
    ...options,
  });
};

export const findOneAndUpdate = async ({
  model,
  filter = {},
  update = {},
  options = {},
} = {}) => {
  return await model.findOneAndUpdate(filter, update, {
    new: true,
    runValidators: true,
    ...options,
  });
};

export const findByIdAndUpdate = async ({
  model,
  id,
  update = {},
  options = {},
} = {}) => {
  return await model.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
    ...options,
  });
};

export const deleteOne = async ({model,filter = {} , options = {}} = {}) => {
    return await model.deleteOne(filter , options)
}

export const findOneAndDelete = async ({model,filter = {} , options = {}} = {}) => {
    return await model.findOneAndDelete(filter , options)
}

export const findByIdAndDelete = async ({model,id, options = {}} = {}) => {
    return await model.findByIdAndDelete(id, options)
}

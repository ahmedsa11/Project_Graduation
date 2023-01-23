const ErrorHandler = require('./ErrorHandler');

class APIFeatures {
  constructor(query, queryOptions) {
    this.query = query;
    this.queryOptions = queryOptions;
  }
  filter() {
    const queryObj = { ...this.queryOptions };
    const excludedFields = ['select', 'sort', 'page', 'limit'];
    excludedFields.forEach((field) => delete queryObj[field]);
    this.query = this.query.find(queryObj);
    return this;
  }

  sort() {
    const sort = this.queryOptions.sort;
    if (!sort) return this;
    const sortBy = sort.split(',').join(' ');
    this.query = this.query.sort(sortBy);
    return this;
  }

  select() {
    let select = this.queryOptions.select;
    if (!select || select.trim().length == 0) {
      this.query = this.query.select('-password -__v');
      return this;
    }
    select = select.split(',').join(' ');
    if (select.includes('password'))
      throw new ErrorHandler('Invalid selected fields', 400);
    this.query = this.query.select(select);
    return this;
  }

  paginate() {
    const page = +this.queryOptions.page || 1;
    const limit = +this.queryOptions.limit || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }

  getQuery() {
    return this.query;
  }
}

module.exports = APIFeatures;

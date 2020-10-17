const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

//Factory function for creating
exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: document,
      },
    });
  });

//Factory function for deleting
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id);

    if (!document) {
      return next(new AppError('No document found with the ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: {
        data: null,
      },
    });
  });

//Factory function for updating
exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!document) {
      return next(new AppError('No document found with the ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: document,
      },
    });
  });

//Factory function for reading
exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    //Update the query if populate filed is existed
    let query = Model.findById(req.params.id);
    if (populateOptions) query = query.populate(populateOptions);

    //Execute query
    const document = await query;

    if (!document) {
      return next(new AppError('No document found with the ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: document,
      },
    });
  });

//Factory function for reading all
exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    //For nested GET route for reviews
    let filter = {};
    //If req URL contains a hike id, filter hike
    if (req.params.hikeId) filter = { hike: req.params.hikeId };

    //Execute the query
    const feature = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const document = await feature.query;

    //Send the response
    res.status(200).json({
      status: 'success',
      result: document.length,
      data: {
        data: document,
      },
    });
  });

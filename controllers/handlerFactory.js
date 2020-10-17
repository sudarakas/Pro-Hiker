const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

//Factory function for delete
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id);

    if (!document) {
      return next(new AppError('No document found with the ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: {
        document: null,
      },
    });
  });

//Factory function for update
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
        document: document,
      },
    });
  });

const Hike = require('../models/hikeModel');
const catchAsync = require('../utils/catchAsync');
const handlerFactory = require('./handlerFactory');
const AppError = require('../utils/appError');

//Middleware for modify the route
exports.aliastopHikes = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  req.query.fields = 'name,price,ratingAverage,summary,difficulty';
  next();
};

//Get all hikes
exports.getAllHikes = handlerFactory.getAll(Hike);
//Get hike
exports.getHike = handlerFactory.getOne(Hike, { path: 'reviews' });
//Add new hike
exports.createHike = handlerFactory.createOne(Hike);
//Update hike
exports.updateHike = handlerFactory.updateOne(Hike);
//Delete hike
exports.deleteHike = handlerFactory.deleteOne(Hike);

//Get the hike status
exports.getHikeStats = catchAsync(async (req, res, next) => {
  const stats = await Hike.aggregate([
    {
      $match: { ratingAverage: { $gte: 0.0 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numHikes: { $sum: 1 }, //each object will add 1
        numRating: { $sum: '$ratingQty' },
        averageRating: { $avg: '$ratingAverage' },
        averagePrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { minPrice: 1 },
    },
    // {
    //   $match: { _id: { $ne: 'HARD' } },
    // },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getMonthyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;

  const plan = await Hike.aggregate([
    {
      $unwind: '$startDates', //seperate record per each elemenets of the array
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numHikesStarts: { $sum: 1 },
        hikes: { $push: '$name' }, //add the hike name to result
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0, //hide the fields in the result
      },
    },
    {
      $sort: { numHikesStarts: 1 },
    },
    {
      $limit: 12,
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});

exports.getHikeWithinRange = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng)
    next(new AppError('lat and lng placed on wrong order', 400));

  const hikes = await Hike.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    status: 'success',
    data: {
      data: hikes,
    },
  });
});

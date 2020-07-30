const Hike = require('../models/hikeModel');
const APIFeatures = require('../utils/apiFeatures');

//middleware for modify the route
exports.aliastopHikes = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  req.query.fields = 'name,price,ratingAverage,summary,difficulty';
  next();
};

//get all hikes
exports.getAllHikes = async (req, res) => {
  try {
    //execute the query
    const feature = new APIFeatures(Hike.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const hikes = await feature.query;

    //send the response
    res.status(200).json({
      status: 'success',
      result: hikes.length,
      data: {
        hikes: hikes,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

//add new hike
exports.createHike = async (req, res) => {
  try {
    const newHike = await Hike.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newHike,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};

//get a hike
exports.getHike = async (req, res) => {
  try {
    const hike = await Hike.findById(req.params.id);
    // const hike = Hike.findOne({_id: req.params.id});
    res.status(200).json({
      status: 'success',
      data: {
        tour: hike,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

//update hike
exports.updateHike = async (req, res) => {
  try {
    const hike = await Hike.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        hike: hike,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

//delete hike
exports.deleteHike = async (req, res) => {
  try {
    await Hike.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: {
        hike: null,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.getHikeStats = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.getMonthyPlan = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

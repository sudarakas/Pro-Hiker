const Hike = require('../models/hikeModel');

//get all hikes
exports.getAllHikes = async (req, res) => {
  try {
    //filter the req query for non search keywords
    const queryObject = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((element) => delete queryObject[element]);

    //advanced filtering for the query
    let queryStr = JSON.stringify(queryObject);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`); //add $ sign to query
    let query = Hike.find(JSON.parse(queryStr));

    //sort the request
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      //default case for the sort
      query = query.sort('-createdAt');
    }

    //limit the fields
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    //execute the query
    const hikes = await query;

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

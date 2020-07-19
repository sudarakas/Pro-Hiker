const Hike = require('../models/hikeModel');

//get all hikes
exports.getAllHikes = async (req, res) => {
  try {
    const hikes = await Hike.find();

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

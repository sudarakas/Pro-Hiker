const Hike = require('../models/hikeModel');

//get all hikes
exports.getAllHikes = (req, res) => {
  res.status(200).json({
    status: 'success',
    // result: hikes.length,
    // data: {
    //   hikes: hikes,
    // },
  });
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
exports.getHike = (req, res) => {
  /*
            note: we can use ? to set optional params
            eg: /api/v1/hikes/:id/:user?
            in here, the user id is optional
        */

  // const id = req.params.id  * 1;
  // const hike = hikes.find(element => element.id === id)
  // console.log(hike)

  res.status(200).json({
    status: 'success',
    data: {
      //   hikes: hikes[req.params.id],
    },
  });
};

//update hike
exports.updateHike = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      hike: 'Updated',
    },
  });
};

exports.deleteHike = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: {
      hike: 'null',
    },
  });
};

const mongoose = require(`mongoose`);

//hikes scheme
const hikesScheme = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A hike must have a name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 0.0,
  },
  price: {
    type: Number,
    required: [true, 'A hike must have a price'],
  },
});

//create the model with scheme
const Hike = mongoose.model('Hike', hikesScheme);

module.exports = Hike;

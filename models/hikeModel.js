const mongoose = require(`mongoose`);

//hikes scheme
const hikesScheme = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A hike must have a name'],
    unique: true,
    trim: true,
  },
  ratingAverage: {
    type: Number,
    default: 0.0,
  },
  ratingQty: {
    type: Number,
    default: 0,
  },
  duration: {
    type: Number,
    required: [true, 'A hike must have a duration'],
  },
  minGroupSize: {
    type: Number,
    required: [true, 'A hike must have a minimum group size'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A hike must have a maximum group size'],
  },
  difficulty: {
    type: String,
    required: [true, 'A hike must have a difficulty'],
  },
  price: {
    type: Number,
    required: [true, 'A hike must have a price'],
  },
  priceDiscount: {
    type: Number,
  },
  description: {
    type: String,
    trim: true,
    required: [true, 'A hike must have a description'],
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'A hike must have a summary'],
  },
  imageCover: {
    type: String,
    required: [true, 'A hike must have a cover image'],
  },
  images: {
    type: [String],
    required: [true, 'A hike must have a cover image'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  startDates: [Date],
});

//create the model with scheme
const Hike = mongoose.model('Hike', hikesScheme);

module.exports = Hike;

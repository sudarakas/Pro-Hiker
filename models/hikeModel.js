const mongoose = require(`mongoose`);
const slugify = require(`slugify`);
//const User = require('./userModel');

//hikes scheme
const hikesScheme = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A hike must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'Hike name must have less or equal than 40 characters'],
      minlength: [10, 'Hike name must have more or equal than 10 characters'],
      //validate: [validator.isAlphanumeric, 'Hike name must b'],
    },
    slug: {
      type: String,
    },
    ratingAverage: {
      type: Number,
      default: 0.0,
      min: [1, 'Rating must be greater than 1.0'],
      max: [5, 'Rating must be less than 5.0'],
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
      enum: {
        values: ['easy', 'medium', 'difficult', 'extreme'],
        message: 'Invalid difficulty level is selected',
      },
    },
    price: {
      type: Number,
      required: [true, 'A hike must have a price'],
    },
    priceDiscount: {
      type: Number,
      //this validation only for create not for update
      validate: {
        validator: function (value) {
          return value < this.price;
        },
        message:
          'Price discount ({VALUE}) must be less than the price of the hike',
      },
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
    secretHike: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      //Geo-JSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enm: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  },
  {
    toJSON: { virtuals: true }, //to select the virtual objetcs
    toObject: { virtuals: true },
  }
);

//Document Middleware: Only runs before .save() and .create()
hikesScheme.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

/*
  Embeding Example - Data Modeling
*/
//Set the User Models to the hike
// hikesScheme.pre('save', async function (next) {
//   //Get the User Models - Return Promise Array
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));

//   //guidesPromises Array will be resolved here
//   this.guides = await Promise.all(guidesPromises);

//   next();
// });

//Query Middleware
hikesScheme.pre(/^find/, function (next) {
  this.find({ secretHike: { $ne: true } });
  next();
});

//Aggregation Middleware
hikesScheme.pre('aggregate', function (next) {
  //add new condition to pipeline
  this.pipeline().unshift({ $match: { secretHike: { $ne: true } } });
  next();
});

//virtual properties
hikesScheme.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//create the model with scheme
const Hike = mongoose.model('Hike', hikesScheme);

module.exports = Hike;

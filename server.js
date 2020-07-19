/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
const dotenv = require(`dotenv`);
const mongoose = require(`mongoose`);
dotenv.config({ path: `./config.env` });
const app = require(`./app`);

//database connection string
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

//connect the database
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB Connected');
  });

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

//create a new hike
const testHike = new Hike({
  name: 'Namunukula Hike',
  rating: 4.9,
  price: 4500,
});

//save the hike
testHike
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.log(err);
  });

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

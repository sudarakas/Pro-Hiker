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
 
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

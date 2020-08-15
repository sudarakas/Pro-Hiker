/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
const dotenv = require(`dotenv`);
const mongoose = require(`mongoose`);

//for uncaught exception
process.on('uncaughtException', (error) => {
  console.log(`Error: ${error.name}, Info: ${error.message}`);
  console.log('Server Shutting Down!');

  //terminate the server
  process.exit(1);
});

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

const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

//for unhandled rejection - safetyNet
process.on('unhandledRejection', (error) => {
  console.log(`Error: ${error.name}, Info: ${error.message}`);
  console.log('Server Shutting Down!');

  //close the server before terminate
  server.close(() => {
    process.exit(1);
  });
});

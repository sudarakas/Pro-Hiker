/* eslint-disable no-console */
const express = require('express');
const morgan = require('morgan');
const hikeRouter = require('./routes/hikeRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json()); //convert json to js obj
app.use(express.static(`${__dirname}/public`)); //access static contentes from public
app.use((req, res, next) => {
  console.log('went through the middleware');
  next();
});

//routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/hikes', hikeRouter);

//for all undefined routes
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on the server`,
  });
});

module.exports = app;

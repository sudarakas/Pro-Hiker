/* eslint-disable no-console */
const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');

const errorHandler = require('./controllers/errorController');
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
  next();
});

//routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/hikes', hikeRouter);

//for all undefined routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on the server`, 404));
});

app.use(errorHandler);

module.exports = app;

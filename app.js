/* eslint-disable no-console */
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');

const errorHandler = require('./controllers/errorController');
const hikeRouter = require('./routes/hikeRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();

//Middlewares

//Security HTTP headers
app.use(helmet());

//Development Support
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Limit the number of requests
const apiLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message:
    'Too many requests received from this IP, please try again after an half hour',
});

app.use('/api', apiLimiter);

//Body parser, reading data from body (convert json to js obj)
app.use(express.json({ limit: '20kb' }));

//Data Sanitization - NOSQL Query Injection
app.use(mongoSanitize());

//Data Sanitization - XSS
app.use(xss());

//Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'difficulty',
      'maxGroupSize',
      'ratingQty',
      'ratingAverage',
    ],
  })
);

//Access static contentes from public
app.use(express.static(`${__dirname}/public`));

//Test
app.use((req, res, next) => {
  next();
});

//Routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/hikes', hikeRouter);
app.use('/api/v1/reviews', reviewRouter);

//For all undefined routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on the server`, 404));
});

app.use(errorHandler);

module.exports = app;

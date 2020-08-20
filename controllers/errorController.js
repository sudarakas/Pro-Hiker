const AppError = require('../utils/appError');

const sendErrorDevelopmnet = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProduction = (err, res) => {
  //known error: infrom the client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    //unknown error: hide the error stack
  } else {
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong. Try Again',
    });
  }
};

const handleCastErrorDB = (error) => {
  const message = `Invalid ${error.path}: ${error.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (error) => {
  const message = `Duplicate field value: ${JSON.stringify(
    error.keyValue
  )}. Please use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (error) => {
  const errors = Object.values(error.errors).map((element) => element.message);
  const message = `Inavlid input data: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJsonWebTokenError = () => {
  return new AppError('Invalid access token. Please sign in again!', 401);
};

const handleTokenExpiredError = () => {
  return new AppError('Session has been expired. Please sign in again!', 401);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  //spefic error messages based on env
  if (process.env.NODE_ENV === 'development') {
    sendErrorDevelopmnet(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    //production mode errors
    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (err.name === 'JsonWebTokenError') error = handleJsonWebTokenError();
    if (err.name === 'TokenExpiredError') error = handleTokenExpiredError();
    sendErrorProduction(error, res);
  }
};

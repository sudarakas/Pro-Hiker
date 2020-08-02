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
    console.error('ERROR', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong. Try Again',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  //spefic error messages based on env
  if (process.env.NODE_ENV === 'development') {
    sendErrorDevelopmnet(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    sendErrorProduction(err, res);
  }
};

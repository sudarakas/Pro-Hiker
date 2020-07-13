const express = require('express');
const morgan = require('morgan');
const app = express();


//middlewares
app.use(morgan('dev'));
app.use(express.json()); //convert json to js obj
app.use((req, res, next) => {
    console.log('went through the middleware')
    next();
})

//routes
const hikeRouter = require('./routes/hikeRoutes');
const userRouter = require('./routes/userRoutes');

app.use('/api/v1/users', userRouter);
app.use('/api/v1/hikes', hikeRouter);


module.exports = app;

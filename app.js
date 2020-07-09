const fs = require('fs');
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


const hikes = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`
    ));


//get all hikes
const getAllHikes = (req, res) => {
    res
        .status(200)
        .json({
            status: 'success',
            result: hikes.length,
            data: {
                hikes: hikes
            }
        })
}

//add new hike
const addNewHike = (req, res) => {

    const newId = hikes[hikes.length - 1].id + 1;
    const newHike = Object.assign({ id: newId }, req.body)

    hikes.push(newHike);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(hikes), (err) => {
        res
            .status(201)
            .json({
                status: 'success',
                data: {
                    hike: newHike
                }
            })
    })
}

//get a hike
const getHikeById = (req, res) => {
    /*
        note: we can use ? to set optional params
        eg: /api/v1/hikes/:id/:user?
        in here, the user id is optional
    */

    // const id = req.params.id  * 1;
    // const hike = hikes.find(element => element.id === id)
    // console.log(hike)


    if (req.params.id > hikes.length) {
        return res
            .status(404)
            .json({
                status: 'fail',
                message: '404 - Plan Not Found'
            })
    }

    res
        .status(200)
        .json({
            status: 'success',
            data: {
                hikes: hikes[req.params.id]
            }
        })
}

//update hike
const updateHike = (req, res) => {

    if (req.params.id > hikes.length) {
        return res
            .status(404)
            .json({
                status: 'fail',
                message: '404 - Plan Not Found'
            })
    }

    res
        .status(200)
        .json({
            status: 'success',
            data: {
                hike: 'Updated'
            }
        })
}

const deleteHike = (req, res) => {

    if (req.params.id > hikes.length) {
        return res
            .status(404)
            .json({
                status: 'fail',
                message: '404 - Plan Not Found'
            })
    }

    res
        .status(204)
        .json({
            status: 'success',
            data: {
                hike: 'null'
            }
        })
}

//routes
// app.get('/api/v1/hikes', getAllHikes);
// app.post('/api/v1/hikes', addNewHike);
// app.get('/api/v1/hikes/:id', getHikeById);
// app.patch('/api/v1/hikes/:id', updateHike);
// app.delete('/api/v1/hikes/:id', deleteHike);

app
    .route('/api/v1/hikes')
    .get(getAllHikes)
    .post(addNewHike)

app
    .route('/api/v1/hikes/:id')
    .get(getHikeById)
    .patch(updateHike)
    .delete(deleteHike)



//run the server
const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}`)
})

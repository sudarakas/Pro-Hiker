const fs = require('fs');

const hikes = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

exports.checkHikeId = (req, res, next, val) => {
    if (req.params.id > hikes.length) {
        return res
            .status(404)
            .json({
                status: 'fail',
                message: '404 - Plan Not Found'
            })
    }
    next();
}

exports.validBody = (req, res, next) => {
    if (req._body != true) {
        return res
            .status(400)
            .json({
                status: 'fail',
                message: 'Bad Request'
            })
    }
    next();
}

//get all hikes
exports.getAllHikes = (req, res) => {
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
exports.createHike = (req, res) => {

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
exports.getHike = (req, res) => {
    /*
        note: we can use ? to set optional params
        eg: /api/v1/hikes/:id/:user?
        in here, the user id is optional
    */

    // const id = req.params.id  * 1;
    // const hike = hikes.find(element => element.id === id)
    // console.log(hike)

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
exports.updateHike = (req, res) => {
    res
        .status(200)
        .json({
            status: 'success',
            data: {
                hike: 'Updated'
            }
        })
}

exports.deleteHike = (req, res) => {

    res
        .status(204)
        .json({
            status: 'success',
            data: {
                hike: 'null'
            }
        })
}
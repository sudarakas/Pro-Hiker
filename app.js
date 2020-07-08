const fs = require('fs');
const express = require('express');

const app = express();
const port = 3000;

//middlewares
app.use(express.json()); //convert json to js obj

const hikes = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`
    ));

app.get('/api/v1/hikes', (req, res) => {
    res
        .status(200)
        .json({
            status: 'success',
            result: hikes.length,
            data: {
                hikes: hikes
            }
        })
})


app.post('/api/v1/hikes', (req, res) => {

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


})

//specify id
app.get('/api/v1/hikes/:id', (req, res) => {
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
})


//run the server
app.listen(port, () => {
    console.log(`App running on port ${port}`)
})

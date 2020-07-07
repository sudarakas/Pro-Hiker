const fs = require('fs');
const express = require('express');

const app = express();
const port = 3000;

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







//run the server
app.listen(port, () => {
    console.log(`App running on port ${port}`)
})

const express = require('express');
//init express app
const app = express();
//set the port
const port = 3000;

//routes
app.get('/', (req, res) => {
    res
        .status(200)
        .json({
            message: 'Server is working fine',
            app: 'Travel Me'
        })
})

app.post('/', (req, res) => {
    res.send('Post req route')
})

//run the server
app.listen(port, () => {
    console.log(`App running on port ${port}`)
})
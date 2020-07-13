const express = require('express');
const router = express.Router();
const { getAllHikes, getHike, createHike, updateHike, deleteHike } = require('../controllers/hikeController')

router
    .route('/')
    .get(getAllHikes)
    .post(createHike)

router
    .route('/:id')
    .get(getHike)
    .patch(updateHike)
    .delete(deleteHike)

module.exports = router;
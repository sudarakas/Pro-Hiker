const express = require('express');
const router = express.Router();
const { getAllHikes, getHike, createHike, updateHike, deleteHike, checkHikeId } = require('../controllers/hikeController')

//can use this type middleware to validate id
router.param('id', checkHikeId)

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
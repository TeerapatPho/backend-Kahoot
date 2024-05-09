const express = require('express');
const { createRoom, getAllRooms, joinRoom, terminateRoom, startRoom } = require('../controllers/room.controller');

const router = express.Router()

// create room session
router.post('/:quiz_id', createRoom);

// get all rooms
router.get('/', getAllRooms);

// join room
router.patch('/:room_pin', joinRoom);

// start room
router.patch('/start/:room_id', startRoom);

// terminate room
router.patch('/terminate/:room_id', terminateRoom);

module.exports = router;
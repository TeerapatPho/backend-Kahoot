const express = require('express');
const { createRoom, getAllRooms, joinRoom, terminateRoom, startRoom, recieveAnswer, getOneRoom, getOneRoomByPin } = require('../controllers/room.controller');
const { verifyFirebaseToken, verifyWebsocketToken } = require('../middlewares/auth.middleware')

const router = express.Router()

// create room session
router.post('/:quiz_id', verifyFirebaseToken, createRoom);

// get all rooms
router.get('/', verifyFirebaseToken, getAllRooms);

// get one room
router.get('/frontend/:room_id', verifyFirebaseToken, getOneRoom);
router.get('/websocket/:room_id', verifyWebsocketToken, getOneRoom);
router.get('/pin/:room_pin', verifyFirebaseToken, getOneRoomByPin);

// join room
router.patch('/:room_pin', verifyWebsocketToken, joinRoom);

// start room
router.patch('/start/:room_id', verifyWebsocketToken, startRoom);

// send answer
router.put('/start/:room_id', verifyWebsocketToken, recieveAnswer);

// terminate room
router.patch('/terminate/:room_id', verifyWebsocketToken, terminateRoom);

module.exports = router;
const express = require('express');
const { createRoom, getAllRooms, joinRoom, terminateRoom, startRoom, recieveAnswer, getOneRoom } = require('../controllers/room.controller');
const { verifyFirebaseToken, verifyWebsocketToken } = require('../middlewares/auth.middleware')

const router = express.Router()

// create room session
router.post('/:quiz_id', verifyFirebaseToken, createRoom);

// get all rooms
router.get('/', verifyFirebaseToken, getAllRooms);

// get one rooms
router.get('/:room_id', function (req, res, next) {
  if (req.query.source === 'frontend') {
    verifyFirebaseToken(req, res, next);
  } else if (req.query.source === 'websocket') {
    verifyWebsocketToken(req, res, next);
  } else {
    return res.status(401).json({
      success: false,
      message: "Doesn't put the 'source' in query"
    })
  }
}, getOneRoom);


// join room
router.patch('/:room_pin', verifyWebsocketToken, joinRoom);

// start room
router.patch('/start/:room_id', verifyWebsocketToken, startRoom);

// send answer
router.put('/start/:room_id', verifyWebsocketToken, recieveAnswer);

// terminate room
router.patch('/terminate/:room_id', verifyWebsocketToken, terminateRoom);

module.exports = router;
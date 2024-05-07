const express = require('express');
const { createRoom, joinRoom, terminateRoom, startRoom } = require('../controllers/room.controller');
const verifyFirebaseToken = require('../middlewares/auth.middleware');

const router = express.Router()

// create room session
router.post('/:quiz_id', verifyFirebaseToken, createRoom);

// join room
router.patch('/:room_pin', (req, res, next) => {
  if (req.query.method === 'guest') {
    req.user_id = req.body.data.displayName;
    next();
  } 
  else if (req.query.method === 'authenticate') {
    return next('route'); // Pass the request to the next handler
  }
  else {
    return res.json({success: false, message: "No specific method to login"})
  }
}, joinRoom);
router.patch('/:room_pin', verifyFirebaseToken, joinRoom);

// start room
router.patch('/start/:room_id', verifyFirebaseToken, startRoom);

// terminate room
router.patch('/terminate/:room_id', verifyFirebaseToken, terminateRoom);

module.exports = router;
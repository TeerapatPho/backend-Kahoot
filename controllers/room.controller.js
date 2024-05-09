const RoomModel = require('../models/room.model')

const createRoom = async (req, res) => {
  const data = req.body.data;

  try {
    const room_data = {
      room_status: 'waiting',
      room_pin: await generateUniquePin(),
      start_time: null,
      end_time: null,
      max_player: data.max_player,
      quiz_id: req.params.quiz_id,
      players: [],
      time_limit: data.time_limit,
    }

    const room = await RoomModel.create(room_data);

    return res.status(200).json({
      success: true,
      room: room,
    });
  } catch (error) {
    console.error("Error on creating room:", error);
    return res.status(500).json({ success: false, message: "Error on creating room" });
  }
}

const joinRoom = async (req, res) => {
  const user_id = req.user_id;

  try {
    const room = await RoomModel.findOne({ room_pin: req.params.room_pin, room_status: 'waiting', room_mode: req.query.method }).exec();

    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    if (room.players.length == room.max_player) {
      return res.status(400).json({ success: false, message: "Max player exceed" });
    }

    if (room.players.some(p => p.user_id == user_id)) {
      return res.status(400).json({ success: false, message: "Player already in the room" });
    }

    room.players.push({user_id: user_id, results: []});
    await room.save();

    return res.status(200).json({
      success: true,
      room: room,
    })
  } catch (error) {
    console.error("Error on joining room:", error);
    return res.status(500).json({ success: false, message: "Error on joining room" });
  }
}

const startRoom = async (req, res) => {
  try {
    const room = await RoomModel.findOne({ _id: req.params.room_id, room_status: 'waiting' }).exec();

    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    room.room_status = 'started';
    room.start_time = Date.now();
    await room.save();

    return res.status(200).json({
      success: true,
      room: room,
    });
  } catch (error) {
    console.error("Error on starting room:", error);
    return res.status(500).json({ success: false, message: "Error on starting room" });
  }
}

const terminateRoom = async (req, res) => {
  try {
    const room = await RoomModel.findOne({ _id: req.params.room_id, room_status: 'started' }).exec();

    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    room.room_status = 'terminated';
    room.end_time = Date.now();
    await room.save();

    return res.status(200).json({
      success: true,
      room: room,
    });
  } catch (error) {
    console.error("Error on terminating room:", error);
    return res.status(500).json({ success: false, message: "Error on terminating room" });
  }
}

function generatePinString(length) {
  const characters = '0123456789';
  let pin = '';
  for (let i = 0; i < length; i++) {
    pin += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return pin;
}

// Function to generate a unique pin string not already in use in the given room
async function generateUniquePin() {
  let pin;
  let roomExists = true;
  while (roomExists) {
    pin = generatePinString(6); // Generate a pin string of desired length
    const existingRoom = await RoomModel.findOne({ pin_string: pin, room_status: { $in: ['waiting', 'started'] } });
    if (!existingRoom) {
      roomExists = false; // Exit the loop if pin is unique
    }
  }
  return pin;
}

module.exports = {
  createRoom,
  joinRoom,
  startRoom,
  terminateRoom,
}
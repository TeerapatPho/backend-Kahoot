const express = require('express');
const { getAllRecord, getOneRecord, appendRecord, deleteMyRecord } = require('../controllers/record.controller');

const router = express.Router()

router.get('/', getAllRecord);

router.get('/:quiz_id', getOneRecord);

router.put('/:quiz_id', appendRecord);

router.delete('/:quiz_id', deleteMyRecord);

module.exports = router;
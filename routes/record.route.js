const express = require('express');
const { getAllRecord, getOneRecord, appendRecord, deleteMyRecord } = require('../controllers/record.controller');

const router = express.Router()

router.get('/', getAllRecord);

router.get('/:record_id', getOneRecord);

router.patch('/:record_id', appendRecord);

router.delete('/:record_id', deleteMyRecord);

module.exports = router;
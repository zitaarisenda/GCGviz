const express = require('express');
const router = express.Router();
const direksiController = require('../controllers/direksiController');

router.get('/', direksiController.getAllDireksi);
router.get('/:id', direksiController.getDireksiById);
router.post('/', direksiController.createDireksi);
router.put('/:id', direksiController.updateDireksi);
router.delete('/:id', direksiController.deleteDireksi);

module.exports = router; 
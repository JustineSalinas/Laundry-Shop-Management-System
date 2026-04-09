const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// All staff routes require admin privileges
router.use(authMiddleware, adminMiddleware);

router.get('/', staffController.getStaff);
router.post('/', staffController.createStaff);
router.put('/:id', staffController.updateStaff);
router.delete('/:id', staffController.deleteStaff);

module.exports = router;

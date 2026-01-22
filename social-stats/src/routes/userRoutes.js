
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isLoggedIn, isAdmin } = require('../middleware/authMiddleware');


// Rotte da server.js:
router.get('/', userController.getUsers);
router.get('/:id/profile', userController.getUserProfile);
router.get('/:id/actions', userController.getUserActions);
router.get('/:id/classifications', userController.getUserClassifications);
router.post('/:id/stats', userController.addStats);
router.post('/subscribe', userController.subscribe);
router.post('/:id/addPoints', userController.addPoints);
router.post('/:id/role', isLoggedIn, isAdmin, userController.changeRole);
router.delete('/:id', isLoggedIn, isAdmin, userController.deleteUser);

module.exports = router;

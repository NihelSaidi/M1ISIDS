const express = require('express');
const {
  login,
  verifyUser,
  getMe,
  resetPassword,
  forgotPassword,
} = require('../controllers/authController.js');

const verifyToken = require('../middleware/authMiddleware.js'); 

const router = express.Router();

router.post("/login", login);
router.post("/verifyuser/:activationCode", verifyUser);
router.get("/verify", verifyToken, getMe); 
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;

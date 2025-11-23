const express = require('express');
const { 
  createUser, 
  getAllUsers, 
  deleteUser, 
  getUserById, 
  updateUser, 
  activateAccount 
} = require('../controllers/userController.js');

// const upload = require('../config/multerConfig.js');
const zlib = require('zlib');

const router = express.Router();

router.post("/create", createUser);
router.get('/getAll', getAllUsers);
router.get('/users/:id', getUserById);
router.delete('/delete/:id', deleteUser);
router.put('/update/:id', updateUser);
router.get("/account-activation/:activationCode", activateAccount);
// export default router; avec import dans ES module
module.exports = router;

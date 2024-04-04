const app = require('express');
const router = app.Router();
require('dotenv').config();
const userController = require('../controllers/userController');
const authenticateToken = require('../middlewares/authMiddleware');

router.post('/register',userController.registerUser);

router.get('/activation',userController.userActivation);

router.post('/login',userController.loginUser);

router.get('/user-auth', authenticateToken, (req, res)=>{
  res.status(200).send({status:true})
}); 

module.exports = router;
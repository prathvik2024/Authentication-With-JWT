const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const userModel = require('../models/userModel')
const stringGenerator = require('../helper/stringGenerator');
require('dotenv').config()

module.exports = {
  registerUser: async (req, res) => {
    try {
      let errors = [];
      if (!validator.isAlpha(req?.body?.fname) || !validator.isAlpha(req?.body?.lname)) {
        errors.push('Invalid first name and last name');
      } if (!validator.isEmail(req?.body?.email)) {
        errors.push('Invalid email!');
      }
      if (errors.length !== 0) {
        return res.status(400).json({ status: false, errors });
      }

      const { fname, lname, email } = req.body;
      // check if user already exist
      const existingUser = await userModel.getUserByEmail(email);
      if (existingUser.result.length >= 1) {
        return res.status(400).json({ status: false, error: 'User already exists' });
      }

      
      const activationLink = stringGenerator(21);
      // create new user
      const userId = await userModel.createUser(fname, lname, email, activationLink);
      console.log(userId);
      // respond with success register
      res.status(201).json({ status: true, message: "User registered successfully", userId: userId.result.insertId, activationLink });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: false, error: 'Internal server error' });
    }
  },

  loginUser: async (req, res) => {
    try {
      let errors = [];
      if (!validator.isEmail(req.body.email)) {
        errors.push('Invalid credentials!');
      } if (!validator.isLength(req.body.password, { min: 8 })) {
        errors.push('Password must be 8 character long');
      }
      if (errors.length !== 0) {
        console.log(errors.toString());
        return res.status(400).json({ status: false, errors: errors.toString()});
      }

      const { email, password } = req.body;
      // fetch user from database
      const user = await userModel.getUserByEmail(email);
      console.log("user: ", user);
      if (!user) {
        return res.status(401).json({ status: false, error: 'Invalid credentials' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.result[0].password);
      if (!isPasswordValid) {
        return res.status(401).json({ status: false, error: 'Invalid credentials' })
      }

      // generate access token
      const accessToken = jwt.sign({ user }, process.env.SECRET_KEY, { expiresIn: '5m' });
      // res.cookie('auth_token', accessToken, { maxAge: 900000 });
      res.status(200).json({ status: true, user: user.result[0], accessToken });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: false, error });
    }
  },
  checkUserActivation : async (req, res)=>{
    const {id, activationLink} = req?.body;
    const verifyActivateUser = await userModel.getUserByActivationLink(id, activationLink);
    if(verifyActivateUser.result.length == 1){
      res.status(200).json({ status: verifyActivateUser.status, userId: verifyActivateUser.result[0].id });
    }else{
      res.status(401).json({ status: false, error: 'User activation failed' });
    }
  },
  updateRegisterPassword : async (req, res)=>{
    const {id, password} = req?.body;

    // hash the password
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

    const registerUser = await userModel.updatePasswordAndActivateUser(id, hashPassword);
    console.log(registerUser);
    if(registerUser.result.affectedRows == 1){
      res.status(200).json({ status: registerUser.status });
    }else{
      res.status(401).json({ status: false, error: 'User registration failed' });
    }
  }
};
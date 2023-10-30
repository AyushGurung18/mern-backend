const express = require("express");
const bcrypt = require("bcrypt");
require('dotenv').config();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const College = require("../models/college");
const secret = process.env.JWT_SECRET;
const verifyToken = require("../middleware");
const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    const token = jwt.sign({ userId: user._id }, secret);

    res.cookie('token' , token , { httpOnly:true });
    res.status(200).json({ message: "Signup successful", token });

    await user.save();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
  
    const { email, password } = req.body;
    if(!email || !password){
      return res.status(400).json({message: "All fields are required"})
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ userId : user._id }, secret);
    
    res.cookie('token' , token , { httpOnly:true });
    res.status(200).json({ message: "Login successful", token }); // Send a response to the client


  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/logout' , (req, res)=>{
  res.clearCookie('token');
  res.json({success:true});
});

router.get('/user-info', async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Authorization token is missing' });
  }
  
  try {
    const { userId } = jwt.verify(token, secret);
    const user = await User.findById(userId);
  
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
  
    const username = user.username;
    res.status(200).json({ username });
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
  
  
});

router.post('/collegeAdd' , async (req , res)=> {
  try{
  const {name , location , progOffered , estYear} = req.body;
  const existingCollege = await College.findOne({name});

  if(existingCollege){
     return res.status(400).json({message:'existing college'});
  }
   else{
    const college = new College({name , location , progOffered , estYear});
    await college.save();
 
   }
   }catch(err){
     console.error('error:' , err);
}});

router.get('/colleges/search', async (req, res) => {
  const { query } = req.query;

  try {
    const results = await College.find({ name: { $regex: new RegExp(query, 'i') } });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/univlist', verifyToken,  async (req, res) => {
  try {
    const universities = await College.find();
    res.json(universities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/univlist/:id', async (req, res) => {
  try {
    const university = await College.findById(req.params.id);
    if (!university) {
      return res.status(404).json({ message: 'University not found' });
    }
    res.json(university);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/colleges/search', verifyToken, async (req, res) => {
  const query = req.query.query;
  try {
    const colleges = await College.find({
      name: { $regex: new RegExp(query, "i") }
    });
    res.json(colleges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

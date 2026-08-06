import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const signIn = async (req, res,next) => {
  const {email,password}=req.body;
  try{
    const user=await User.findOne({email})
    if(!user){
        return res.status(404).json({message:"User not found"});
    }
    const isPasswordCorrect =await bcrypt.compare(password,user.password)
    if(!isPasswordCorrect){
        return res.status(400).json({message:"Invalid Credentials"});

    }
    const token =jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"1D"})
    res.status(200).json({token,user})
    next();
  }catch(error){
    res.status(500).json({message:"Something went wrong"});
    next(error);
  }
}


export const signUp = async (req, res, next) => {
    const { username, email, password } = req.body;
  
    try {
      const existingUser = await User.findOne({ email });
  
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });
  
      await newUser.save();
  
      const token = jwt.sign(
        { id: newUser._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
  
      return res.status(201).json({
        token,
        user: newUser,
      });
    } catch (error) {
      return next(error);
    }
  };

export const logout = async (req, res) => {}

export default { signIn, signUp, logout };
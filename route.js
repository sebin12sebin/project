const express = require('express');
var app = express.Router();
const nodemailer = require('nodemailer');
const crypto = require('crypto');

var User = require("../model/userModel");

app.post('/api/register', async (req, res) => {
    try {
  
      const { email, firstName, lastName, phoneNumber, address, password } = req.body;
  
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email is already registered' });
      }
  

      const newUser = new User({ email, firstName, lastName, phoneNumber, address, password });
  
 
      const savedUser = await newUser.save();
  
      res.json(savedUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  
  app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
  
      const user = await User.findOne({ email });
  
      if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
  
      // Successful login
      res.json({ message: 'Login successful', user: { id: user._id, email: user.email } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/api/forgot-password', async (req, res) => {
    try {
      const { email,phoneNumber } = req.body;
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: 'Email not found' });
      }

      const otp = Math.floor(100000 + Math.random() * 900000);
  

      user.resetPasswordOTP = otp;
      await user.save();
 
      const transporter = nodemailer.createTransport({
        // configure nodemailer with your email service details
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'grocerygo000@gmail.com',
          pass: 'cnqe cryf vpma xwui',
        },
      });
  
      const mailOptions = {
        from: 'grocerygo000@gmail.com',
        to: email,
        subject: 'Password Reset OTP',
        html: `
          <div style="background-color: #f5f5f5; padding: 20px; font-family: Arial, sans-serif;">
            <h2 style="color: #333; font-weight: bold;">Password Reset OTP</h2>
            <p style="font-size: 16px; color: #555;">Dear User,</p>
            <p style="font-size: 16px; color: #555;">Your OTP for password reset is: <span style="color: #FFA500; font-weight: bold;">${otp}</span></p>
            <p style="font-size: 14px; color: #777;">Please use this OTP to reset your password.</p>
            <p style="font-size: 14px; color: #777;">If you did not request a password reset, please ignore this email.</p>
          </div>
        `,
      };
      
  
      await transporter.sendMail(mailOptions);
  
      res.json({ message: 'OTP sent to your email for password reset' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  app.post('/api/reset-password', async (req, res) => {
    try {
      const {  otp, newPassword } = req.body;
  
      const user = await User.findOne({
        resetPasswordOTP: otp,
      });
  
      if (!user) {
        return res.status(401).json({ error: 'Invalid OTP or email' });
      }
  
      // Update the password
      user.password = newPassword;
      user.resetPasswordOTP = undefined;
      await user.save();
  
      res.json({ message: 'Password reset successful' });
      console.log("Password reset successful")
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  module.exports = app;
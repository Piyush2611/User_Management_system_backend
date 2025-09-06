// controllers/authController.js
require("dotenv").config();
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
// const User = require("../models/User");
const database = require("../index");
const User = database.user;


exports.signup = async (req, res) => {
  const transaction = await database.sequelize.transaction(); // start transaction

  try {
    const { fullName, email, password, confirmPassword } = req.body;

    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const existingUser = await User.findOne({ where: { email }, transaction });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const image = req.file ? req.file.filename : null;

    console.log("image",image);
    // return
    

    const user = await User.create(
      {
        full_name: fullName,
        email,
        password: hashedPassword,
        profile_image:image,
        role_id: 2,
      },
      { transaction }
    );

    await transaction.commit();

    res.status(200).json({
      code: 200,
      message: "User created successfully.",
      user: {
        id: user.id,
        fullName: user.full_name, // match column name
        email: user.email,
        profile_image: user.profileImage,
      },
    });
  } catch (error) {
    await transaction.rollback(); // rollback if anything fails
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getProfiledetails = async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const userdetails = await database.user.findOne({
      where: { user_id },
      attributes: ['user_id', 'full_name', 'email', 'profile_image']
    });

    if (!userdetails) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      code: 200,
      data: userdetails
    });

  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
};









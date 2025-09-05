// controllers/authController.js
require("dotenv").config();
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
// const User = require("../models/User");
const database = require("..");
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
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    await transaction.rollback(); // rollback if anything fails
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.login = async (req, res) => {
  try {

     console.log("Request headers:", req.headers);
    console.log("Request body:", req.body);
    console.log("Content-Type header:", req.get('Content-Type'));
    
    // Check if req.body exists before destructuring
    if (!req.body) {
      return res.status(400).json({ message: "Request body is missing" });
    }
    const { email, password } = req.body;

    // console.log("body",req.body);

    // return
    

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign(
      { id: user.id, roleId: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    await user.update({ token });

    res.status(200).json({
      code: 200,
      message: "Login successful.",
      token,
      user_id: user.user_id,
      role_id: user.role_id,
      user: {
        // user_id: user.user_id,
        fullName: user.full_name,
        email: user.email,
        profileImage: user.profileImage,
        // role_id: user.role_id,
      },
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.getusers = async (req, res) => {
  try {
    const { role_id, user_id } = req.query;

    if (!user_id || !role_id) {
      return res.status(400).json({
        code: 400,
        message: "Missing 'user_id' or 'role_id' in query.",
      });
    }

    let users;

    if (role_id === "1") {
      // Admin: show all users except self
      users = await User.findAll({
        attributes: ["user_id", "full_name", "email", "profile_image", "role_id", "createdAt"],
        where: {
          isDeleted: false,
          user_id: { [Op.ne]: user_id },
        },
        order: [["createdAt", "DESC"]],
      });
    } else {
      // Normal user: only self
      users = await User.findAll({
        attributes: ["user_id", "full_name", "email", "profile_image", "role_id", "createdAt"],
        where: {
          isDeleted: false,
          user_id,
        },
      });
    }

    res.status(200).json({
      code: 200,
      message: "Users fetched successfully.",
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      code: 500,
      message: "Internal server error.",
      error: error.message,
    });
  }
};


const database = require("..");
require("dotenv").config();
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const User = database.user;

exports.getAllSection = async (req, res) => {
  try {
    const sections = await database.section.findAll();

    res.status(200).json({
      code: 200,
      message: 'Sections retrieved successfully.',
      data: sections,
    });
  } catch (error) {
    console.error('Error fetching sections:', error);
    res.status(500).json({
      code: 500,
      message: 'Internal server error.',
    });
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

    // Convert to numbers (important for comparisons)
    const roleIdNum = Number(role_id);
    const userIdNum = Number(user_id);

    let users;

    if (roleIdNum === 1) {
      // Admin: show all users except self
      users = await User.findAll({
        attributes: ["user_id", "full_name", "email", "profile_image", "role_id", "createdAt"],
        where: {
          isDeleted: false,
          user_id: { [Op.ne]: userIdNum },
        },
        order: [["createdAt", "DESC"]],
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

exports.deleteUser = async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({
        code: 400,
        message: "Missing 'user_id' in request body.",
      });
    }

    // Find the user
    const user = await User.findOne({ where: { user_id, isDeleted: false } });

    if (!user) {
      return res.status(404).json({
        code: 404,
        message: "User not found or already deleted.",
      });
    }

    user.isDeleted = true;
    await user.save();

    res.status(200).json({
      code: 200,
      message: "User deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      code: 500,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

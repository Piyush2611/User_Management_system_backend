// controllers/authController.js

const bcrypt = require("bcryptjs");
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

    const user = await User.create(
      {
        full_name: fullName,
        email,
        password: hashedPassword,
        profileImage: req.file ? req.file.filename : null,
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

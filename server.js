require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Database = require('./app/index');

// Express app
const app = express();
app.use(bodyParser.json()); // For JSON
app.use(bodyParser.urlencoded({ extended: true }));
// Add this after your bodyParser middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  console.log('Body:', req.body);
  console.log('Content-Type:', req.get('Content-Type'));
  next();
});

app.use(cors({
  origin: ['https://user-management-system-frontend-sepia.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use("/uploads", express.static("uploads"));

// Test DB Connection
Database.sequelize.authenticate()
  .then(() => console.log("Database connected..."))
  .catch((err) => console.error("❌ Error: " + err.message));

// Database.sequelize.sync({ alter: true })
//   .then(() => {
//     console.log("Synced Successfully.");
//   })
//   .catch((error) => {
//     console.error("Error synchronizing models:", error);
//   });


// Routes (sample)
app.get("/", (req, res) => {
  res.send("Server is running...");
});

require("./app/user/route")(app);
require("./app/admin/route")(app);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

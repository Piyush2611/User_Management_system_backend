require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Database = require('./app/index');

// Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use(cors({
  origin: "*",
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

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

require("dotenv").config();
const Sequelize = require("sequelize");


const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || "mysql",
    port: process.env.DB_PORT || 3306,
    logging: true,
  }
);
const database = {};
database.sequelize = sequelize;
database.Sequelize = Sequelize;

database.user = require("./user/model")(sequelize,Sequelize);


module.exports = database;
const User = require('./controller');
const upload = require("../middleware/upload_files");
// const {authenticate}  = require("../middleware/auth");

module.exports = app=>{
    app.post("/signup",upload.any("profileImage"),User.signup);
}
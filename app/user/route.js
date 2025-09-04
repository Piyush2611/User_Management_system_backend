const User = require('./controller');
const upload = require("../middleware/upload_files");

module.exports = app=>{
    app.post("/signup",upload.any("profileImage"),User.signup);
}
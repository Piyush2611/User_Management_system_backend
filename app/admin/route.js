const admin = require("./controller");

module.exports = app=>{
    app.get('/getallsections',admin.getAllSection);
    app.post("/login",admin.login);
    app.get("/getusers",admin.getusers);
    app.post("/delete_user",admin.deleteUser);
}
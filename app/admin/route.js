const section = require("./controller");

module.exports = app=>{
    app.get('/getallsections',section.getAllSection);
}
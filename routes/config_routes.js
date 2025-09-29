const usersR = require("./users");
const countriesR = require("./countries");
const {auth}= require("../middlewares/auth"); 

exports.routesInit = (app) => {
  app.use("/users",usersR);
  app.use(auth);
  app.use("/countries",countriesR);
}
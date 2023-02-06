const mongoose = require("mongoose");

const connection = mongoose.connect(
  "mongodb+srv://rudramanu:rudramanu@cluster0.bzmxh4v.mongodb.net/jwt_auth_06feb?retryWrites=true&w=majority"
);

module.exports = { connection };

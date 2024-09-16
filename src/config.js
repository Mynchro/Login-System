const mongoose = require("mongoose");

const connect = async () => {
  try {
    await mongoose.connect(`mongodb://localhost:27017/Login`);
    console.log(`Erfolgreich mit der Datenbank verbunden`);
  } catch (error) {
    console.error(`Datenbankverbindung fehlgeschlagen`, error);
  }
};

connect();
//Schema
const LoginSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// collection Part

const collection = new mongoose.model("users", LoginSchema);

module.exports = collection;

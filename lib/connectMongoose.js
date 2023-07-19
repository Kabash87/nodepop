"use strict";

//Configuracion de conexion a la Base de datos
const mongoose = require("mongoose");

mongoose.connection.on("error", function (err) {
  console.error("Error de conexion a la base de datos:", err);
  process.exit(1);
});

mongoose.connection.once("open", function () {
  console.info("Conectado a la base de datos");
});

const connectionPromise = mongoose.connect("mongodb://127.0.0.1/nodepop", {
  useUnifiedTopology: true,
});
//Se exporta la promesa
module.exports = connectionPromise;

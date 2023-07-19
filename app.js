"use strict";
//Servicio de Ventas

const express = require("express");
const createError = require("http-errors");
const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

//Conexion a base de datos
const { isAPI } = require("./lib/utils");
require("./models");

const app = express();

// Iniciador de Api
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//Variables principales del Programa
app.locals.title = "NodePop";

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public"))); //Carpeta Publica

//Rutas del Proyecto
app.use("/", require("./routes/index"));
app.use("/anuncios", require("./routes/anuncios"));

//Ruta del Apiv1
app.use("/apiv1/anuncios", require("./routes/apiv1/anuncios"));

//Error del 404
app.use((req, res, next) => next(createError(404)));

// Configuracion de errores
app.use((err, req, res, next) => {
  if (err.array) {
    // Error de Validacion
    err.status = 422;
    const errInfo = err.array({ onlyFirstError: true })[0];
    err.message = isAPI(req)
      ? { message: "no es valido", errors: err.mapped() }
      : `no es valido - ${errInfo.param} ${errInfo.msg}`;
  }

  err.status = err.status || 500;
  res.status(err.status);

  // Error de Peticion al Api
  if (isAPI(req)) {
    res.json({ error: err.message });
    return;
  }

  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.render("error");
});

//Se exporta la App
module.exports = app;

"use strict";

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const Anuncio = mongoose.model("Anuncio");
const { buildAnuncioFilterFromReq } = require("../../lib/utils");

// Listado de anuncios
router.get("/", (req, res, next) => {
  const start = parseInt(req.query.start) || 0;
  const limit = parseInt(req.query.limit) || 1000; // nuestro api devuelve max 1000 registros
  const sort = req.query.sort || "_id";
  const includeTotal = req.query.includeTotal === "true";

  const filters = buildAnuncioFilterFromReq(req);

  // Ejemplo hecho con callback, aunque puede hacerse mejor con promesa y await
  Anuncio.list(
    filters,
    start,
    limit,
    sort,
    includeTotal,
    function (err, anuncios) {
      if (err) return next(err);
      res.json({ result: anuncios });
    }
  );
});

// Tags disponibles
router.get(
  "/tags",
  asyncHandler(async function (req, res) {
    const distinctTags = await Anuncio.distinct("tags");
    res.json({ result: distinctTags });
  })
);

// Crear
router.post(
  "/",
  [
    body("Nombre").isAlphanumeric().withMessage("tiene que tener solo letras"),
    body("Venta").isBoolean().withMessage("debe ser SI o NO"),
    body("Precio").isNumeric().withMessage("tiene que ser un numero entero"),
  ],
  asyncHandler(async (req, res) => {
    validationResult(req).throw();
    const anuncioData = req.body;

    const anuncio = new Anuncio(anuncioData);
    const anuncioGuardado = await anuncio.save();

    res.json({ result: anuncioGuardado });
  })
);

module.exports = router;

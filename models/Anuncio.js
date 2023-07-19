"use strict";

//Utilidades de los anuncios
const mongoose = require("mongoose");
const configAnuncios = require("../local_config").anuncios;
const path = require("path");

//Declaracion de Variables
const anuncioSchema = mongoose.Schema({
  nombre: { type: String, index: true },
  venta: { type: Boolean, index: true },
  precio: { type: Number, index: true },
  foto: String,
  tags: { type: [String], index: true },
});

/**
 * lista de tags permitidos
 */
anuncioSchema.statics.allowedTags = function () {
  return ["trabajo", "Cotidiano", "Automovil", "Electronica"];
};

//Carga de Json de Anuncios
anuncioSchema.statics.cargaJson = async function (fichero) {
  const anuncios = JSON.parse(data).anuncios;
  const numAnuncios = anuncios.length;

  for (var i = 0; i < anuncios.length; i++) {
    await new Anuncio(anuncios[i]).save();
  }

  return numAnuncios;
};

anuncioSchema.statics.list = async function (
  filters,
  startRow,
  numRows,
  sortField,
  includeTotal,
  cb
) {
  const query = Anuncio.find(filters);
  query.sort(sortField);
  query.skip(startRow);
  query.limit(numRows);

  const result = {};

  if (includeTotal) {
    result.total = await Anuncio.countDocuments();
  }
  result.rows = await query.exec();

  //Ruta de Imagenes
  const ruta = configAnuncios.imagesURLBasePath;
  result.rows.forEach(
    (r) => (r.foto = r.foto ? path.join(ruta, r.foto) : null)
  );

  if (cb) return cb(null, result);
  return result;
};

var Anuncio = mongoose.model("Anuncio", anuncioSchema);

module.exports = Anuncio;

"use strict";

const router = require("express").Router();
const asyncHandler = require("express-async-handler");

//Mostrar Index principal
router.get(
  "/",
  asyncHandler(async function (req, res) {
    res.render("index");
  })
);

module.exports = router;

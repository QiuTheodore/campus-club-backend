const express = require("express");
const router = express.Router();

const {
  getHighlights,
} = require("../controllers/highlight.controller");

router.get("/", getHighlights);

module.exports = router;
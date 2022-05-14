const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("map/index");
});

module.exports = router;

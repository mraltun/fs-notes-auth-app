const express = require("express");
const router = express.Router();
const path = require("path");

// Requested route is only a slash "/" or index or index.html (html is optional)
router.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

module.exports = router;

const headController = require("../Controllers/head");
var express = require("express");
var router = express.Router();

router.get("/dashboard", headController.dashboard);

module.exports = router;

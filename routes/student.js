const studentController = require("../Controllers/student");
var express = require("express");
var router = express.Router();

//get all classes and courses assigned to student
router.get("/dashboard", studentController.dashboard);

module.exports = router;

const teacherController = require("../Controllers/teacher");
var express = require("express");
var router = express.Router();

router.get("/dashboard", teacherController.dashboard);

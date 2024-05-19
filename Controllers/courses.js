const mongoose = require("mongoose");
const Course = require("../models/courses");

const addCourse = async (req, res) => {
  try {
    const { name, department, teachers, students } = req.body;

    const newCourse = new Course({
      name,
      department,
      teachers: teachers || [],
      students: students || [],
    });

    await newCourse.save();
    res.status(201).send(newCourse);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error.message });
  }
};

module.exports = { addCourse };

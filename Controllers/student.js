const mongoose = require("mongoose");
const Course = require("../models/courses");
const Student = require("../models/student");

const withdrawCourse = async (req, res) => {
  try {
    const { cid } = req.params;
    const { studentId } = req.body; // Assuming student ID is passed in the request body

    const course = await Course.findById(cid);
    if (!course) {
      return res.status(404).send({ error: "Course not found" });
    }

    course.students = course.students.filter(
      (student) => student.sid.toString() !== studentId
    );
    await course.save();

    res.send({ message: "Successfully withdrawn from the course" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const enrollCourse = async (req, res) => {
  try {
    const { cid } = req.params;
    const { studentId } = req.body; // Assuming student ID is passed in the request body

    const course = await Course.findById(cid);
    if (!course) {
      return res.status(404).send({ error: "Course not found" });
    }

    const studentExists = course.students.some(
      (student) => student.sid.toString() === studentId
    );
    if (studentExists) {
      return res
        .status(400)
        .send({ error: "Student already enrolled in this course" });
    }

    course.students.push({
      sid: new mongoose.Types.ObjectId(studentId),
      marks: 0,
    });
    await course.save();

    res.send({ message: "Successfully enrolled in the course" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};


module.exports = { withdrawCourse, enrollCourse };

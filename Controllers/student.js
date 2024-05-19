const Student = require("../models/student");
const Class = require("../models/class");
const Courses = require("../models/courses");

module.exports.dashboard = async (req, res) => {
  try {
    const studentId = req.query.studentId; // taking studentId from query
    if (!studentId) {
      return res.status(400).json({ error: "Student ID is required" });
    }

    const student = await Student.findById(studentId).exec();
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const classes = await Class.find({ "students.sid": studentId }) //getting a students's classes
      .select("name department")
      .exec();
    console.log(classes);

    const courses = await Courses.find({ "students.sid": studentId }) //getting a students's courses
      .select("name department")
      .exec();

    res.json({
      student: {
        name: student.name,
        rollno: student.rollno,
        department: student.department,
      },
      classes,
      courses,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

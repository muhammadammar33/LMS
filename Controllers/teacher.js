const Class = require("../models/class");
const Courses = require("../models/courses");
const Teacher = require("../models/teacher");

module.exports.dashboard = async (req, res) => {
  try {
    const teacherId = req.query.teacherId;
    if (!teacherId) {
      return res.status(400).json({ error: "Teacher ID is required" });
    }
    const teacher = await Teacher.findById(teacherId).exec();
    if (!teacher) {
      return res.status(404).send({ message: "Teacher not found" });
    }

    const courses = await Courses.find({ "teachers.tid": teacherId })
      .select("name department")
      .exec();

    const classes = await Class.find({ "teachers.tid": teacherId })
      .select("name department")
      .exec();

    res.json({
      teacher: {
        id: teacher._id,
        name: teacher.name,
        designation: teacher.designation,
        department: teacher.department,
      },
      courses,
      classes,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const Head = require("../models/head");
const Teacher = require("../models/teacher");
const Student = require("../models/student");
const Class = require("../models/class");

module.exports.dashboard = async (req, res) => {
  try {
    const headId = req.query.headId; // taking headId from body
    if (!headId) {
      return res.status(400).json({ error: "Head ID is required" });
    }
    const head = await Head.findById(headId);
    if (!head) {
      return res.status(404).json({ error: "Head not found" });
    }
    const department = head.department;
    const teacherCount = await Teacher.countDocuments({ department });
    const studentCount = await Student.countDocuments({ department });
    const classCount = await Class.countDocuments({ department });

    res.json({
      department,
      teachers: teacherCount,
      students: studentCount,
      classes: classCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

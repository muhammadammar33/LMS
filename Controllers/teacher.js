const Teacher = require("../models/teacher");
const Class = require("../models/class");

const getStudentsInSpecificClassTaughtByTeacher = async (req, res, next) => {
  try {
    const { cid } = req.params;

    Class.findById(cid)
      .populate("teachers.tid")
      .populate("students.sid")
      .exec()
      .then(
        (clas) => {
          const students = clas.students;

          const actualStudents = students.map((el) => {
            return el.sid;
          });

          res.statusCode = 200;
          res.json(actualStudents);
        },
        (err) => {
          return err;
        }
      );
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
};

const dashboard = async (req, res) => {
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

module.exports = { getStudentsInSpecificClassTaughtByTeacher, dashboard };

const express = require("express");
const router = express.Router();
const Student = require("../models/student");
const Class = require("../models/class");
const Course = require("../models/courses");
const Teacher = require("../models/teacher");
const { withdrawCourse, enrollCourse } = require("../Controllers/student");

// GET Routes
router.get("/", function (req, res, next) {
  res.send("Student Dashboard");
});

// Route to get teachers for a student
router.get("/teachers/:sid", async (req, res) => {
  try {
    const studentId = req.params.sid;

    // Find all classes that the student is enrolled in
    const classes = await Class.find({ "students.sid": studentId }).populate(
      "teachers.tid"
    );

    // Extract the unique teachers from the classes
    const teachers = [];
    const teacherIds = new Set();

    classes.forEach((classItem) => {
      classItem.teachers.forEach((teacher) => {
        if (!teacherIds.has(teacher.tid._id.toString())) {
          teacherIds.add(teacher.tid._id.toString());
          teachers.push(teacher.tid);
        }
      });
    });

    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to get grades for a student
router.get("/grades/:sid", async (req, res) => {
  const { sid } = req.params;

  try {
    const courses = await Course.find(
      { "students.sid": sid },
      "name students.$"
    );

    const grades = courses.map((course) => {
      const studentData = course.students.find(
        (student) => student.sid.toString() === sid
      );
      return {
        courseName: course.name,
        marks: studentData.marks,
      };
    });

    res.json({ grades });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Route to get a certain course's grades for a student
router.get("/grades/:sid/:cid", async (req, res) => {
  const { sid } = req.params;
  const { cid } = req.params;

  try {
    const marksOfAllStds = await Course.findOne({"_id":cid.toString()});
    const allStudents = marksOfAllStds.students;

    marks = "Not found"

    for(const student of allStudents){
      if(student.sid == sid.toString())
        marks = student.marks
    }

    res.json(marks);

  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Route to withdraw from a course
router.delete("/withdrawcourse/:cid", async (req, res) => {
  withdrawCourse(req, res);
});

// Route to enroll in a course
router.post("/enrollcourse/:cid", async (req, res) => {
  enrollCourse(req, res);
});

//Get student enrolled in particular course
router.get('/getStudentEnrolled', function(req, res, next){
    const courseId = req.body.courseId;
    Course.findById(courseId).populate('students.sid')
        .then((course)=>{
            if(!course){
                res.statusCode=404;
                res.json({message:"Course not found"});
            }
            else{
                res.statusCode=200;
                res.json(course.students);
            }
        }, (err)=>{
            return (err);
        })
});

//Get details of a specific student enrolled in classes taught by the teacher.
router.get('/:studentId/teacher/:teacherId', async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const teacherId = req.params.teacherId;

    // Find the student
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Find the teacher
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // Find the courses taught by the teacher and enrolled by the student
    const courses = await Course.find({
      teachers: { $elemMatch: { tid: teacherId } },
      students: { $elemMatch: { sid: studentId } },
    }).populate('teachers.tid', 'name designation department')
     .populate('students.sid', 'name rollno department');

    res.json({ student, teacher, courses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

//Update marks of a student in a course
router.put('/:studentId/courses/:courseId', async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const studentId = req.params.studentId;
    const { marks } = req.body;

    // Find the course and update the student's marks
    const course = await Course.findOneAndUpdate(
      { _id: courseId, 'students.sid': studentId },
      { $set: { 'students.$.marks': marks } },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ message: 'Course or student not found' });
    }

    res.json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});


module.exports=router;

module.exports = router;

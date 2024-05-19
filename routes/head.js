var express = require("express");
var router = express.Router();
var Courses = require("../models/courses");
const mongoose = require("mongoose");
const Teacher = require("../models/teacher");


//GET Routes
router.get("/", function (req, res, next) {
  res.send("Head Dashboard");
});
router.post('/head/assigncourse/:cid/:tid', async (req, res) => {
  try {
    const courseId = req.params.cid;
    const teacherId = req.params.tid;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    if (course.department !== teacher.department) {
      return res.status(400).json({ message: 'Teacher and course department mismatch' });
    }

    course.teachers.push({ tid: teacher._id });
    await course.save();

    res.status(200).json({ message: 'Teacher assigned to the course successfully', course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE routes, remove teacher from deparment
router.put("/removeteacher/:tid", async (req, res, next) => {
  try{
    const {tid} = req.params;
    const teacher = await Teacher.findByIdAndUpdate(tid, {department: "null"});
     if(!teacher){
      return res.status(404).json({message: "Teacher not found"});
    }

    res.status(200).json({message: "Teacher removed from department successfully"});

  }
  catch{
    res.status(500).json({message: error.message});
  }
})
;

// GET Route to get a course taught by a specific teacher
router.get("/getcourse/:tid", async (req, res, next) => {
  try {
    const { tid } = req.params;
    const courses = await Course.find({ "teachers.tid": tid }).populate('teachers.tid');

    if (!courses || courses.length === 0) {
      return res.status(404).json({ message: "No courses found for this teacher" });
    }

    res.status(200).json(courses);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//route to get marks of all courses of a student
router.get("/getmarks/:sid", (req, res) => {
  const studentId = req.params.sid;
  console.log(`Fetching marks for student ID: ${studentId}`);

  // Convert studentId to ObjectId
  const studentObjectId = new mongoose.Types.ObjectId(studentId);

  // Find all courses that the student is enrolled in and get the marks
  Courses.find({ "students.sid": studentObjectId })
    .populate({
      path: "students.sid",
      select: "name", // Select only the 'name' field from the Student model
    }) // Correctly populate student details
    .exec()
    .then((courses) => {
      // Log the result to check its structure
      console.log(`Courses found: ${courses ? courses.length : 0}`);
      console.log(courses);

      // Check if courses is an array
      if (!Array.isArray(courses)) {
        throw new Error("Unexpected response type, expected an array.");
      }

      // Extract the marks for the specific student
      const result = courses.map((course) => {
        const studentInfo = course.students.find((student) => {
          return student.sid._id.toString() === studentObjectId.toString();
        });
        if (studentInfo) {
          console.log(
            `Marks found for course ${course.name}: ${studentInfo.marks}`
          );
        } else {
          console.log(`No student info found for course ${course.name}`);
        }

        return {
          courseName: course.name,
          marks: studentInfo ? studentInfo.marks : null,
        };
      });

      res.json(result); // Only one response will be sent
    })
    .catch((error) => {
      console.error(`Error retrieving marks: ${error.message}`);
      if (!res.headersSent) {
        // Check if headers are already sent
        res
          .status(500)
          .json({ message: "Error retrieving marks", error: error.message });
      }
    });
});


module.exports = router;

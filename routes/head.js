const express = require("express");
const router = express.Router();
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


module.exports = router;

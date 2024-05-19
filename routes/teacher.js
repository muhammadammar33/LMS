const express = require("express");
const router = express.Router();
const Course= require("../models/courses");
const mongoose = require("mongoose");

//GET Routes
router.get("/", function (req, res, next) {
  res.send("Teacher Dashboard");
});

router.put("/addmarks/:sid/:cid",function(req,res,next){
  const { marks } = req.body; // Assuming marks are passed in the request body

  Courses.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(req.params.cid), 'students.sid': mongoose.Types.ObjectId(req.params.sid) },
    {
      $set: {
        'students.$.marks': marks
      }
    },
    { new: true, upsert: false }
  ).then(
    (result) => {
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: 'Course or student not found' });
      }
    },
    (err) => {
      res.status(500).json({ error: err.message });
    }
  );

})

// Route to reset a student's marks in a certain course to zero
router.delete("/deleteMarks/:sid/:cid", async (req, res) => {
  const { sid, cid } = req.params;

  try {
    // Convert the provided IDs to MongoDB ObjectId
    const courseId = new mongoose.Types.ObjectId(cid);
    const studentId = new mongoose.Types.ObjectId(sid);

    // Update the course to reset the student's marks to zero
    const updatedCourse = await Course.findOneAndUpdate(
      { _id: courseId, "students.sid": studentId },
      { $set: { "students.$.marks": 0 } },
      { new: true }
    );

    // Check if the course exists
    if (!updatedCourse) {
      return res.status(404).json({ error: "Course or student not found" });
    }

    // Return the updated course object
    res.json(updatedCourse);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});
module.exports = router;

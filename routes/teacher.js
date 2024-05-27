const express = require("express");
const router = express.Router();
//GET Routes
router.get("/", function (req, res, next) {
  res.send("Teacher Dashboard");
});
router.put("/updateprofile/:tid", async (req, res) => {
  try {
    const tid = req.params.tid;
    const updates = req.body;

    // Find the teacher by ID and update their profile
    const updatedTeacher = await Teacher.findByIdAndUpdate(tid, updates, { new: true });

    if (!updatedTeacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.json(updatedTeacher);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

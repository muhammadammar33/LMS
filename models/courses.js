const mongoose = require("mongoose");
const coursesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  teachers: {
    type: [
      {
        tid: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Teacher",
        },
      },
    ],
  },
  students: {
    type: [
      {
        sid: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Student",
        },
        marks: {
          type: Number,
          // default: 0,
        },
      },
    ],
  },
});
module.exports = mongoose.model("Courses", coursesSchema);
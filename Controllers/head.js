const Courses = require("../models/courses");

//getTeacchersTeaching


const getCoursesByTeacher = async (req, res, next)=>{

    try {
        const teacherId = req.params.tid;
        
        if (!mongoose.Types.ObjectId.isValid(teacherId)) {
            return res.status(400).json({ error: 'Invalid teacher ID' });
        }

        const teacherCourses = await Courses.find({ teachers: teacherId });

        if (!teacherCourses.length) {
            return res.status(404).json({ error: 'No Courses found for this teacher' });
        }

        res.status(200).json(teacherCourses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }

}

const getTeacchersTeaching = async (req, res, next)=>{

    try {
        const classId = req.params.cid;

        if (!mongoose.Types.ObjectId.isValid(classId)) {
            return res.status(400).json({ error: 'Invalid class ID' });
        }

        const course = await Courses.findById(classId).populate('teachers');

        if (!course) {
            return res.status(404).json({ error: 'Class not found' });
        }

        res.status(200).json(course.teachers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }

}


module.exports = { getCoursesByTeacher , getTeacchersTeaching };
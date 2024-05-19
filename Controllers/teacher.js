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
                })

                res.statusCode = 200;
                res.json(actualStudents);
            },
            (err) => {
                return err;
            }
        )

    } catch (error) {
        return res.status(400).send({ error: error.message });
    }
};

module.exports = { getStudentsInSpecificClassTaughtByTeacher };
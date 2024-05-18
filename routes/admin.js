var express=require("express");
var router= express.Router();
var Class=require('../models/class');
var Teacher=require('../models/teacher');
var Student=require('../models/student');
//GET Routes
router.get('/',function(req,res,next){
    res.send("Admin Dashboard");
});

router.get('/classes',function(req,res,next){
   Class.find().populate('teachers.tid').populate('students.sid').exec()
   .then((clas)=>{
    res.statusCode=200;
    res.json(clas);
   },(err)=>{ return (err)})    
});
router.get('/classes/:id',function(req,res,next){
    Class.find({_id:req.params.id}).populate('teachers.tid').populate('students.sid').exec()
   .then((clas)=>{
    res.statusCode=200;
    res.json(clas);
   },(err)=>{ return (err)})    

});
router.get('/teachers',function(req,res,next){
    Teacher.find().exec()
   .then((teacher)=>{
    res.statusCode=200;
    res.json(teacher);
   },(err)=>{ return (err)})    
});
router.get('/teachers/:id',function(req,res,next){
    Teacher.find({_id:req.params.id}).exec()
   .then((teacher)=>{
    res.statusCode=200;
    res.json(teacher);
   },(err)=>{ return (err)})    
});
router.get('/students',function(req,res,next){
    Student.find().exec()
   .then((student)=>{
    res.statusCode=200;
    res.json(student);
   },(err)=>{ return (err)})    
});
router.get('/students/:id',function(req,res,next){
    Student.find({_id:req.params.id}).exec()
    .then((student)=>{
     res.statusCode=200;
     res.json(student);
    },(err)=>{ return (err)})    
 });

//POST Routes

router.post('/addteacher',function(req,res,next){
    Teacher.create(req.body)
    .then((teacher)=>{
        res.statusCode=200;
        res.json(teacher);
    },(err)=>{return (err)})
    
});
router.post('/addstudent',function(req,res,next){
    Student.create(req.body)
    .then((student)=>{
        res.statusCode=200;
        res.json(student);
    },(err)=>{return (err)})
    
});
router.post('/addclass',function(req,res,next){
    Class.create(req.body)
    .then((clas)=>{
        res.statusCode=200;
        res.json(clas);
    },(err)=>{return (err)})
    
});

//PUT Routes

router.put('/assignteacher/:cid/:tid',function(req,res,next){
   Class.findOneAndUpdate({_id:req.params.cid},{teacher:req.params.tid})
   .then((result)=>{
    res.statusCode=200;
    res.json(result);
   },(err)=>{return (err)})
});
router.put('/assignstudent/:cid/:sid',function(req,res,next){
    Class.findOneAndUpdate({_id:req.params.cid},
    {"$push": {
        "students":{
            "sid": req.params.sid
        }
    }},{new:true, upsert:false})
        .then((result)=>{
     res.statusCode=200;
     res.json(result);
    },(err)=>{return (err)})
 });
router.put('/updateteacher/:id', (req, res, next) => {
    Teacher.findOneAndUpdate({_id: req.params.id}, req.body, {new: true})
    .then((result) => {
        res.statusCode = 200;
        res.json(result);
    }, (err) => { return (err) })
});

//Delete Routes

router.delete('/delclass/:cid',function(req,res,next){
   Class.deleteOne({_id:req.params.cid})
   .then((result)=>{
    res.statusCode=200;
    res.json(result);
   },(err)=>{ return (err)})
});

router.delete('/delstudent/:sid',function(req,res,next){
    Student.deleteOne({_id:req.params.sid})
    .then((result)=>{
     res.statusCode=200;
     res.json(result);
    },(err)=>{ return (err)})
 });
 router.delete('/delteacher/:tid',function(req,res,next){
    Teacher.deleteOne({_id:req.params.tid})
    .then((result)=>{
     res.statusCode=200;
     res.json(result);
    },(err)=>{ return (err)})
 });

module.exports=router;
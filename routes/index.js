var express = require('express');
var router = express.Router();

var multer = require('multer');
var path = require('path');

let storage = multer.diskStorage({
  destination: function(req,file,cb){
    cb(null,'public/images')
  },
  filename: function(req,file,cb){
    cb(null,file.fieldname+'-'+Date.now()+'.'+file.mimetype.split('/')[1]);
  }
});

let fileFilter = (req,file,cb)=>{
  let ext = path.extname(file.originalname);
  if(ext !== '.png'&& ext !=='.jpg'){
    return cb(new Error('Only png and jpg files are accepted'));
  }else{
    return cb(null,true);
  }
}

var upload = multer({storage,fileFilter:fileFilter});

router.post('/upload',upload.array('images'),function(req,res){
  let files = req.files;
  let imgNames = [];

  for( i of files){
    let index = Object.keys(i).findIndex(function(e) {return e=== 'filename'})
    imgNames.push(Object.values(i)[index]);
  }

  req.session.imagefiles = imgNames;

  res.redirect('/');
})

router.get('/',function(req,res,next){
  if(req.session.imagefiles === undefined){
    res.sendFile(path.join(__dirname,'..','/public/html/index.html'));
  }else{
    res.render('index',{images:req.session.imagefiles})
  }
});

module.exports = router;

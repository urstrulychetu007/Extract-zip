var decompress =  require('decompress')
var walk    = require('walk');
var fs = require('fs');
const path = require('path');
var jsonfile = require('jsonfile');
// var download = require('download');
var files = []
const filemap = new Map()
var express = require('express')
app = express();
var glob = require("glob")

const multer = require("multer")

app.set('view engine','ejs')
app.use(express.static(path.join(__dirname)))
function getFiles (dir, files_){
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()){
            getFiles(name, files_);
        } else {
            files_.push(name.substring(7));
        }
    }
    return files_;
}
var zipfileName = ''
var wext = ''
var storage = multer.diskStorage({
  destination: function (req, file, cb) {

      // Uploads is the Upload_folder_name
      cb(null, __dirname)
  },
  // FinalFilename = file.fieldname + "-" + Date.now()+".zip",
  filename: function (req, file, cb) {
    zipfileName = file.fieldname + "-" + Date.now()+".zip";
    wext = file.fieldname + "-" + Date.now()
    cb(null, zipfileName)
  }
})


const maxSize = 100 * 1000 * 1000;

var upload = multer({ 
  storage: storage,
  limits: { fileSize: maxSize },
  fileFilter: function (req, file, cb){
  
      // Set the filetypes, it is optional
      var filetypes = /zip/;
      var mimetype = filetypes.test(file.mimetype);

      var extname = filetypes.test(path.extname(
                  file.originalname).toLowerCase());
      
      if (mimetype && extname) {
          return cb(null, true);
      }
    
      cb("Error: File upload only supports the "
              + "following filetypes - " + filetypes);
    } 

// mypic is the name of file attribute
}).single("zip");       


app.get('/',(req,res)=>{
  
    res.sendFile(path.join(__dirname,'views/temp.html'))
})


writejson = ()=>{

  var id = 1;

  var dir = function (basePath, parent) {
    var jsonTree = [];
    var items;
  
    try {
      items = fs.readdirSync(basePath);
    } catch (e) {
      return null;
    }
  
    for (var itemCounter=0; itemCounter < items.length; itemCounter++) {
      var itemName = items[itemCounter];
      var newPath = basePath + path.sep + itemName;
      var stats;
  
      try {
        stats = fs.statSync(newPath);
      } catch (e) {
        return null;
      }
  
      var item = {
        id: id++,
        text: itemName
      };
  
      if (parent != null) {
        item.parent = parent
      }
  
      if (stats.isDirectory()) {
        var children = dir(newPath, item.id);
        if (children != []) {
          item.children = children; // Possibly array.push(dirSync()) or obj[newPath] = dirSync() ...?
        }
      }
  
      jsonTree.push(item);
    }

    
    return jsonTree;
  }
  var fileName = 'loop.json';

  // setTimeout(()=>{
    var jsonStructure = dir(wext, null);

    jsonfile.writeFile(fileName,jsonStructure,{spaces:2},(err)=>{
      // console.log(err)
      console.log('success ')
  // },60000)
  })
}


app.post('/',(req,res)=>{
  upload(req,res,function(err) {
  
    if(err) {

        // ERROR occured (here it can be occured due
        // to uploading image of size greater than
        // 1MB or uploading different file type)
        res.send(err)
    }
    else {
      files   = [];
 

    try{
        file = decompress(zipfileName,wext,)
    }
    catch
    {
        res.send('read error!!!')
    }
    res.redirect('/extract')
  // writejson();
   

    // res.render('index')

        // SUCCESS, image successfully uploaded
        // res.send("Success,"+ zipfileName +" file uploaded!")
    }
})
//   zipfile = req.body.zipfile;
//  
//     // res.send('hii')
})


app.get('/extract',(req,res)=>{
  // res.send('hello')
  // window.location.reload();

  setTimeout(()=>{
    writejson();

    res.render('index');
},10000)
})



app.listen(8080, ()=>{
    console.log('App running at http://localhost:8080')
})
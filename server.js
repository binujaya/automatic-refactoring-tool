var express = require('express');
var app = express();
var path = require('path');
var multer = require('multer');
var fs = require('fs');
var refactoringManager = require('./refactoringManager');

// NOTE: FileManager is built into the server entry point
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'files');
  },
  filename: function (req, file, cb) {
    cb(null, 'inputFile.js');
  }
});
var upload = multer({ storage: storage });

app.use(express.static(path.join(__dirname,'public')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname,'/views/index.html'));
});

app.post('/send_file', upload.single('nonstcode'), function (req, res) {
  fs.readFile(req.file.path, 'utf8', function (err,data) {
    if (err) {
      throw err;
    }

    var output = refactoringManager.start(data);
    var ast = output.ast;
    var refactoredCode = output.refactoredCode;

    fs.writeFile('./files/ast.js', JSON.stringify(ast, null, 4), function (err) {
      if (err) {
        throw err;
      }
    });
    fs.writeFile('./files/refactoredFile.js', refactoredCode, function (err) {
      if (err) {
        throw err;
      }
    });
    res.send('success');
  });
});

app.get('/ast', function (req,res) {
  res.sendFile(path.join(__dirname+'/files/ast.js'));
});
app.get('/refactoredcode', function (req, res) {
  res.sendFile(path.join(__dirname+'/files/refactoredFile.js'));
});

app.listen(1337);
console.log('find app at port 1337');

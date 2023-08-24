
import multer from 'multer';
var fs = require('fs');
var path = require('path');

var destinationDir = path.join('', "./public/uploads");


const uploadFiles = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {

      const type = req.query.type;
      const path = `${destinationDir}/${type}`;

      if (!fs.existsSync(`${destinationDir}`))
        fs.mkdirSync(`${destinationDir}`);

        if (!fs.existsSync(`${path}`))
        fs.mkdirSync(`${path}`);


      cb(null, path);
    },
    filename: (req, file, cb) => cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }),
})

export default uploadFiles;
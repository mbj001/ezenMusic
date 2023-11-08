const multer = require("multer");

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "./image/tmp");
    },
    finename: function(req, file, cb){
        cb(null, file.filename + "-" + Date.now());
    }
});

const upload = multer({storage: storage});

module.exports = upload;
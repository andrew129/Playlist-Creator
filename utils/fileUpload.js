const multer = require('multer');

module.exports = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, next) => {
        if (!file.mimetype.match(/wav||mp3$i/)) {
            next(new Error('File Type is not supported'), false)
            return;
        }
        next(null, true)
    }
})
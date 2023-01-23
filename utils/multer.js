const multer = require('multer');

const ErrorHandler = require('./ErrorHandler');

const storage = multer.diskStorage({
  destination: 'images',
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/webp'
  ) {
    cb(null, true);
  } else {
    cb(
      new ErrorHandler(
        "Invalid image type, It's must be png, jpg, jpeg or webp",
        400
      ),
      false
    );
  }
};
const upload = multer({ storage: storage, fileFilter: fileFilter }).any();
module.exports = upload;

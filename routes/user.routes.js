const Router = require('express').Router();
const userController = require('../controllers/user.controller');
const multerConfig = require('../utils/multer');

Router.param('mobile', userController.checkMobileExists);

Router.route('/').get(userController.getAll).post(userController.create);
Router.route('/:mobile')
  .get(userController.getOne)
  .patch(userController.update)
  .delete(userController.delete);
Router.patch('/image/:mobile', multerConfig, userController.updateImage);
Router.post('/login', userController.login);

module.exports = Router;

/*
sign up
1- enter data (front)
2- validation (front)
3- /api/users/01024441235 (back)
4- send verification code (firebase)
5- enter code (front)
6- check verification code (firebase) 
7- /api/users/create (back) body{name, mobile, password, gender}

login 
1- enter data (front)
2- /api/users/login (back) body{mobile, password}
*/

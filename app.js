require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');

const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');

const { authApiKey } = require('./controllers/auth.controller');
const ErrorController = require('./controllers/error.controller');
const ErrorHandler = require('./utils/ErrorHandler');

const UserRouter = require('./routes/user.routes');

const app = express();

app.use(helmet());
app.use(
  rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message:
      'Too many requests from this IP, please try again in an hour!',
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const PORT = process.env.PORT || 8080;
const dbURL = process.env.dbURL;
mongoose.connect(dbURL, () => {
  app.listen(PORT, () => {
    console.log('server listening on http://localhost:' + PORT);
  });
});

app.use('/api/users', authApiKey, UserRouter);

app.all('*', authApiKey, (req, res, next) => {
  next(
    new ErrorHandler(
      `${req.originalUrl} is not a hundling router in this server`,
      404
    )
  );
});
app.use(ErrorController.globalErrorHandler);

const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const env = require('./env');
const https = require('https');
const fs = require('fs');

const passportConfig = require('./api/middlewares/passport');

const userRoutes = require('./api/routes/user');

const dbURI = 'mongodb://localhost:27017/facebook';

// Mongoose connect
// mongoose.connect('mongodb://'+ env.MONGO_ATLAS.USERNAME +':'+ env.MONGO_ATLAS.PASSWORD +'@cluster0-shard-00-00-zfwrf.mongodb.net:27017,cluster0-shard-00-01-zfwrf.mongodb.net:27017,cluster0-shard-00-02-zfwrf.mongodb.net:27017/rest_api?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true',{
//   // useNewUrlParser: true
// });
// mongoose.connect('mongodb+srv://anji:anji@cluster0-zfwrf.mongodb.net/test?retryWrites=true');
// mongoose.connect('mongodb://anji:anji407@ds317808.mlab.com:17808/fbapp')
mongoose.connect(dbURI);

// When successfully connected
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected Successfully');
});
// If the connection throws an error
mongoose.connection.on('error', function (err) {
  console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection disconnected');
});

//setup configuration for facebook login
passportConfig();

// Morgan middleware to handle all requests and add logs
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
  extended: true
}));
// static folder
app.use('/uploads', express.static('uploads'));
app.use(express.static(path.join(__dirname, 'dist')));

app.use(bodyParser.json());
// Handling CORS
var corsOption = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token']
};
app.use(cors(corsOption));

// Routes 
app.use('/api/v1', userRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// If no routes found 
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 400;
  next(error);
});

// To handle all the errors in the code
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      'message': error.message
    }
  })
});
const port = process.env.PORT || 8080;
https.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
}, app)
.listen(port, function () {
  console.log('Example app listening on port 8080! Go to https://localhost:8080/')
});

// app.listen(port, () => {
//   console.log('Server is running at port ' + port);
// })

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', reason.stack || reason)
})

module.exports = app;

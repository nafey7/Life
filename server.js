const express = require('express');
const dotenv = require('dotenv')
dotenv.config({path: './config.env'});
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

const userRoute = require('./routes/userRoute');
const eventRoute = require('./routes/eventRoute');
const registryRoute = require('./routes/registryRoute');
const serviceRoute = require('./routes/serviceRoute');

const app = express();

mongoose.connect(process.env.dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => console.log("Sucessfully connected to Database"))
    .catch((err) => console.log(err));


app.use(morgan('dev'));
app.use(express.json({limit: '10mb'}));

app.use((req, res, next) => {
    const allowedOrigins = ['https://life-fe.vercel.app', 'http://localhost:3000'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
         res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', true);
    return next();
  });

app.use((req,res,next) => {
    let req_time = new Date().toISOString();
    console.log('The time of the request:',req_time);
    // console.log(req.headers);
    next();
});

app.use('/user', userRoute);
app.use('/event', eventRoute);
app.use('/registry', registryRoute);
app.use('/service', serviceRoute);


const port = process.env.PORT;
app.listen(port, ()=> {
    console.log("App is running on port:",port);
});
const express = require('express');
const dotenv = require('dotenv')
dotenv.config({path: './config.env'});
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

const userRoute = require('./routes/userRoute');
const eventRoute = require('./routes/eventRoute');
const registryRoute = require('./routes/registryRoute');

const app = express();

app.use(cors(corsOptions));

var corsOptions = {
    origin: process.env.ORIGIN,
}

mongoose.connect(process.env.dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => console.log("Sucessfully connected to Database"))
    .catch((err) => console.log(err));


app.use(morgan('dev'));
app.use(express.json());

app.use((req,res,next) => {
    let req_time = new Date().toISOString();
    console.log('The time of the request:',req_time);
    // console.log(req.headers);
    next();
});

app.use('/user', userRoute);
app.use('/event', eventRoute);
app.use('/registry', registryRoute);


const port = process.env.PORT;
app.listen(port, ()=> {
    console.log("App is running on port:",port);
});
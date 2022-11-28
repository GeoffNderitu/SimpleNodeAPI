const express = require('express');
const { default: mongoose } = require('mongoose');
const routes = require('./routes/api');
const cors = require('cors');



const app = express();

app.use(cors({
    // origin: "*",
    origin: "http://localhost:3000",
}))

//Middleware
// const bodyParser = require('body-parser');
app.use(express.json())

app.use(routes);

mongoose.connect('mongodb://localhost/studentdb');

app.use((err, req, res, next)=>{
    res.status(err.status || 500)
    res.send({
        error:{
            status: err.status || 500,
            message: err.message
        }
    })
});

app.listen(process.env.port || 4000, function(){
    console.log('Now listening for request on: http://localhost:4000');
});
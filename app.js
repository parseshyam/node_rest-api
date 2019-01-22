console.log('Starting app.js');
const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

// MONGOBD CONNETION.
mongoose.connect('mongodb+srv://shyam:shyam@node-ne3sr.mongodb.net/test?retryWrites=true', { useNewUrlParser: true });

// JUST TO ADD 
app.use(morgan('dev'));

// MAKE PUBLICALLY USABLE STATIC FOLDER.
app.use('/uploads',express.static('uploads'));

// TO HANDLE PARSING JASON DATA.
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

// DELIGATING SPECIFIC ROUTERS TO SPECIFIC HANDLERS.
const productsRouter = require('./api/routes/products');
const ordersRouter = require('./api/routes/orders');
const userRouter = require('./api/routes/users');
app.use('/products',productsRouter);
app.use('/orders',ordersRouter);
app.use('/user',userRouter);


// IF NONE OF THE URL MATCHES THEN THE FOLLOWING WILL THROW ERROR.
app.use((req,res,next)=>{
    const error = new Error('URL NOT FOUND');
    error.status = 404 ;
    next(error);
});

// THE ABOVE THROWN ERROR WILL BE CATCHED HERE.
app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error : {
            'Error message' : error.message
        }
    });
});

// TO HANDLE CORS [CROSS_ORIGIN_RESOURCE_SHARING] ERRORS.
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','*');
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','GET POST PUT DELETE PATCH');
        return res.status(200).json({});
    }
    next();
});

module.exports = app;
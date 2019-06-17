const express = require("express");
const path = require('path');
const morgan =  require('morgan');
const multer = require('multer');
const uuid = require("uuid/v4");
const bodyParser = require('body-parser')
const app =express();
const {format} = require('timeago.js');

require('dotenv').config();

require('./database');
/**
 * settings
 */
app.set('port',process.env.PORT || 3000)
app.set('views',path.join(__dirname,'views'));
app.set("view engine",'ejs');
/**
 * Moddlwares
 */
app.use(morgan('dev'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));
const storage = multer.diskStorage({
    destination: path.join(__dirname,'public/img/uploads'),
    filename: (req,file,cb,filename) =>{
        cb(null,uuid() + path.extname(file.originalname));
    }
});
app.use(multer({storage:storage}).single('image'));
 /**
  * Global variable
  */
app.use((req,res,next)=>{
    app.locals.format = format
    next();
});

/**
 * Routers
 */
app.use(require('./routers/index'));

/**
 * static files
 */

 app.use(express.static(path.join(__dirname,'public')));

/**
 * Start the server
 */

app.listen(app.get('port'), () =>{
    console.log(`Server on port ${app.get('port')}`);
});
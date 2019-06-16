const { Router } = require('express');
const router = Router()

const path = require("path");
const {unlink} = require('fs-extra');

const Image= require('../models/Image');

const cloudinary = require('cloudinary').v2;
if (typeof(process.env.CLOUDINARY_URL)=='undefined'){
  console.warn('!! cloudinary config is undefined !!');
  console.warn('export CLOUDINARY_URL or set dotenv file')
}else{
  console.log('cloudinary config:');
  console.log(cloudinary.config({
    cloud_name : process.env.CLOUD_NAME , 
    api_key : process.env.API_KEY , 
    api_secret : process.env.API_SECRET  
  }))
}

router.get('/',async (req,res) =>{
    const images = await Image.find();
    res.render("index",{images});
});

router.get('/upload',(req,res) =>{
    res.render('upload')
});

router.post('/upload',async (req,res) =>{
    
    const result = await cloudinary.uploader.upload(req.file.path);

    const image = new Image();
    image.title = req.body.title;
    image.description = req.body.description
    image.filename = req.file.filename;
    image.path = result.url;
    image.originalname = req.file.originalname;
    image.mimetype = req.file.mimetype;
    image.size = req.file.size;
    image.public_id = result.public_id;

    await image.save();

    await unlink(req.file.path);

    res.redirect("/");
});

router.get('/image/:id',async (req,res)=>{
    const image=await Image.findById(req.params.id);
    console.log(image);
    res.render("profile",{image});
})

router.get('/image/:id/delete',async (req,res) =>{
    const { id } = req.params;
    const image = await Image.findByIdAndDelete(id);
    
    const result = await cloudinary.uploader.destroy(image.public_id);
    res.redirect('/');
})

module.exports = router;
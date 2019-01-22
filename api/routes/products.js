console.log('Starting product.js');

const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Product = require('../models/product'); 
const checkAuth = require('../middleware/checkAuth'); // USE IT TOMORROW MIND PISSED RIGHT NOW.
const multer = require('multer');

const storage = multer.diskStorage({
    destination : (req,file,cb) => {
        cb(null,'./uploads');
    },
    filename :(req,file,cb) => {
        cb(null,new Date().toISOString()+file.originalname);
    }    
});

const fileFilter = (req,file,cb) => {
    if(file.mimetype === 'image/jpeg'|| file.mimetype === 'image/png'){
        cb(null,true);
    } else {
        cb(null,false);
    }
}
const upload = multer({
    dest :'uploads/',
    storage : storage,
    fileFilter : fileFilter,
    limits : {
        fileSize : 1024*1024*5 // MAX LIMIT 5MB.
    }
});


router.get('/',(req,res,next)=>{
    Product.find()
    .select('name price _id productImage')
    .exec()
    .then(result => {
        const response = {
            count : result.length,
            Products : result.map(result => {
                return {
                    name  : result.name,
                    price : result.price,
                    id    : result._id,
                    productImage : result.productImage,
                    MetaData : {
                        Request : {
                            Type : 'GET',
                            url  : 'http://127.0.0.1:3000/products/'+result._id
                        }
                    }
                }
            })
        }
        console.log(response);
        res.status(200).json(response);
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            Error : error
        });
    });
    // res.status(200).json({
    //     'Message' : 'Handling GET request'
    // });
});

router.get('/:productId',(req,res,next)=>{
    const id = req.params.productId;
    Product.findById(id)
    .exec()
    .then(result => {
        console.log(result);
        // res.status(200).json(result); You can do this but below used is best response user_friendly
        res.status(200).json({
            name : result.name,
            price: result.price,
            id : result._id,
            ProductImage : result.productImage,
            All_Product : {
                Type :'GET',
                url : 'http://127.0.0.1:3000/products/' // REDIRECT TO VIEW ALL PRODUCTS.
            } 
        });
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            Error : error
        })
    });
    // res.status(200).json({
    //     'Message' : 'Handling GET request for particular ID'
    // });
});

router.post('/',checkAuth,upload.single('productImage'),(req,res,next)=>{
    console.log(req.file);
    const product = new Product({
        _id : new mongoose.Types.ObjectId,
        name : req.body.name,
        price: req.body.price,
        productImage: req.file.path // FILE NAME WILL BE GET STORED.
    });
    product.save()
    .then(result => {
        console.log(result);
        // res.status(201).json(result); You can do this but below used is best response user_friendly
        res.status(201).json({  
            'Message' : 'Handling POST request, Product created !',
            'Created Product' : {
                name : result.name,
                price : result.price,
                id : result._id,
                ProductImage : result.productImage,
                MetaData : {
                    Request : {
                        Type : 'GET',
                        url : 'http://127.0.0.1:3000/products/'+result._id
                    }
                }
            }  
        });
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            Error : error
        });
    });
});

router.patch('/:productId',checkAuth,(req,res,next)=>{
    const id = req.params.productId;
    const UpdateOps = {};
    for(const ops of req.body){
        UpdateOps[ops.propName] = ops.value;
    }
    Product.update({ _id : id } , { $set : UpdateOps })
    .exec()
    .then(result => {
        console.log(result);
        // res.status(200).json(result); You can do this but below used is best response user_friendly
        res.status(200).json({
            Updated_Product : {
                name : result.name,
                price : result.price,
                id : result._id,
                MetaData : {
                    Request : {
                        Type : 'GET',
                        url : 'http://127.0.0.1:3000/products/'+result._id
                    }
                }

            }
        });
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            Error : error
        });
    });
    // res.status(200).json({
    //     'message' : 'Handling PATCH request'
    // });
});


router.delete('/:productId',checkAuth,(req,res,next)=>{
    const id = req.params.productId;
    Product.remove({_id : id })
    .exec()
    .then(result => {
        console.log(result);
     // res.status(200).json(result); You can do this but below used is best response user_friendly
        res.status(200).json({
            Message : 'PRODUCT DELLETED !',
            CREATE_NEW : {
                Type : 'POST',
                url : 'http://127.0.0.1:3000/products',
                Body : {
                    name : 'String',
                    price : 'umber'
                }
            }
        });
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            Error : error
        });
    });
    // res.status(200).json({
    //     'Message' : 'Handling DELETE request'
    // });
});

router.delete('/',checkAuth,(req,res,next) => { // TO DELETE ALL DATA IN DATABASE.
    Product.remove()
    .exec()
    .then(result => {
        console.log(result);
        // res.status(200).json(result); You can do this but below used is best response user_friendly
        res.status(200).json({
            Message : 'ALL PRODUCT DELETED !',
            CREATE_NEW : {
                Type : 'POST',
                url : 'http://127.0.0.1:3000/products',
                Body : {
                    name : 'String',
                    price : 'umber'
                }
            }
        });
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            Error : error
        });
    });
});

module.exports = router;
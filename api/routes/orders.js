console.log('Starting orders.js');

const Order = require('../models/order');
const Product = require('../models/product');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/checkAuth'); // USE IT TOMORROW MIND PISSED RIGHT NOW.

router.get('/',checkAuth,(req,res,next)=>{
    // res.status(200).json({
    //     'message' : 'Handling GET request bro'
    // });
    Order.find()
    .select('_id product quantity')
    .populate('Product') // NEW SEARCH IT FOR MORE INFO.
    .exec()
    .then(result => {
        const response = {
            Count : result.length,
            Orders : result.map(result => { //REMEMBER THIS MAPPING UNLESS RESULT.(DOT) WON'T WORK.   ---> HIGH
              return {
                Orderd_quantity : result.quantity,
                Order_id :result._id,
                Orderd_Product_id : result.product,
                Orderd_Product_url : 'http://127.0.0.1:3000/products/'+result.product
              }
            })
        }
        console.log(result);
        res.status(200).json(response);
     //   console.log('THIS IS '+result.length);
        
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            Error : error
        });
    }); 
 });

router.get('/:orderId',checkAuth,(req,res,next)=>{
    const id = req.params.orderId;
    Order.findById(id).exec()
    .then(result => {
        console.log(result);
        res.status(200).json({
            Order_details : result,
            All_Orders : 'http://127.0.0.1:3000/orders'
        });
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            Error : error
        });
    });
});

router.post('/',checkAuth,(req,res,next)=>{
    // const order = {
    //     orderId : req.body.orderId,
    //     quantity: req.body.quantity
    // }
    // res.status(200).json({
    //     'message' : 'Handling POST request',
    //     'Order Received' : order
    // });


// --> HERE CHECK FIRST THAT THE PRODUCT ID EXISTS IN DATABASE OR NOT ? THAT'S WHY WE'VE IMPORTED 'Product' , SO HERES THE LOGIC.
    Product.findById(req.body.product)
    .then( product => {
        const order = new Order({
            _id : mongoose.Types.ObjectId(),
            product : req.body.product,
            quantity : req.body.quantity               
        });
         order.save()               // REMEMBER THIS STATEMENT RETURNING PROMISE SO THAT NEXT THEN CAN USE IT.   ---> HIGH
        .then(result => {
            console.log(result);
            res.status(201).json({
                Message : 'Order Stored ! ',
                Order_Details : result,
                Orderd_Product_url : 'http://127.0.0.1:3000/products/'+result.product
            });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                Error : error
            });
        });
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            Message : 'Invalid Product ID , not present in database.'
        })
    });
});
// --> END HERE.

router.patch('/:orderId',checkAuth,(req,res,next)=>{
    const id = req.params.orderId;
    res.status(200).json({
        'message' : 'Handling PATCH request'
    });
});

router.delete('/:orderId',checkAuth,(req,res,next)=>{
    const id = req.params.orderId;
    // res.status(200).json({
    //     'message' : 'Handling DELETE request'
    // });
    Order.remove({ _id: id })
    .exec()
    .then(result => {
        console.log(result);
     // res.status(200).json(result); You can do this but below used is best response user_friendly
        res.status(200).json({
            Message : 'ORDER DELLETED !',
            CREATE_NEW : {
                Type : 'POST',
                url : 'http://127.0.0.1:3000/orders',
                Body : {
                    Product : 'ID',
                    quantity : 'Number'
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

router.delete('/',checkAuth,(req,res,next) => {
    Order.remove()
    .exec()
    .then((result) => {
        if(!result){
            res.status(404).json({
                Message : 'NO DATA PRESENT !'
            });
        }else{
            res.status(200).json({
                Message : 'ALL ORDERS DELETED !',
            });
        }
    })
    .catch((error)=>{
        res.status(500).json({
            Error : error
        });
    });
});

module.exports = router ;
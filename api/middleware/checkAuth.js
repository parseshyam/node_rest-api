const jwt = require('jsonwebtoken');
module.exports = (req,res,next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        const decode = jwt.verify(token,'Secrete_key');
        req.userData = decode ;
        next();
    }catch(error){
        return res.status(401).json({
            Message : 'AUTHENTICATION FAILED !'
        });
    };
}

/*
function checkAuth(req,res,next){
    
    // GET AUTH HEADER HERE.
    const bearerHeader = req.headers['authorization'];

    // CHECK IF BEARER HEADER IS UNDEFINED. ?
    if(typeof bearerHeader !== 'undefined' ){
        const bearer = bearerHeader.split(' ')[1];

    } else {
        res.status(403).json({
            Message : Un authorized access !
        });
    }
}



*/
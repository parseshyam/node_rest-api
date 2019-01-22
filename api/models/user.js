const mongoose = require('mongoose');
const userschema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    email : {type :String, 
        required: true, 
        unique: true,
        trim : true, //ADDED NEW.
        match : /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password :{ type: String, required: true, minlength: 6 }

});                                          

module.exports = mongoose.model('user',userschema);
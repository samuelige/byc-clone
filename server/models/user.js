const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SALT_I = 10;
require('dotenv').config();

// Schema method of mongoose
const userSchema = mongoose.Schema(
    // Add configuration here
    {
        email: {
            type: String,
            required: true,
            unique: 1,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6
        },
        name: {
            type: String,
            required: true,
            maxlength: 100
        },
        lastName: {
            type: String,
            required: true,
            maxlength: 100
        },
        cart: {
            type: Array,
            default: []
        },
        history: {
            type: Array,
            default: []
        },
        role: {
            type: Number,
            default: 0
        },
        token: {
            type: String
        }
    }
);

// pre() : do something for me before return the whole values

userSchema.pre('save', function(next){
    let user = this;

    if(user.isModified('password')){

        // Encrypt password

        bcrypt.genSalt(SALT_I, function(err, salt){
            if (err) return next(err);
    
            bcrypt.hash(user.password,salt,function(err, hash){
                if (err) return next(err);
                user.password = hash;
                next();
            })
        })
    } else{
        next();
    }
});


// Compare password
userSchema.methods.comparePassword = function(candidatePassword, cb){
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
        if(err) return cb(err);
        cb(null, isMatch);
    })
};

// Generate token
userSchema.methods.generateToken = function(cb){
    let user = this;
    let token = jwt.sign(user._id.toHexString(), process.env.SECRET);

    user.token = token;
    user.save(function(err, user){
        if(err) return cb(err);
        cb(null, user);
    })
}

// Find user by token
userSchema.statics.findByToken = function(token, cb){
    let user = this;

    jwt.verify(token, process.env.SECRET, function(err, decode){
        user.findOne({"_id": decode, "token": token}, function(err, user){
            if(err) return cb(err); 
            cb(null, user);
        })
    })
};

// Create a model from the userSchema
const User = mongoose.model('User', userSchema);

module.exports = {User};
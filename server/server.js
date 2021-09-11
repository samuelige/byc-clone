const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASE);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());


// *** MODELS ***//
const { User } = require('./models/user');
const {Brand} = require('./models/brand');
const {Product} = require('./models/product');
const {ProductCategories} = require('./models/product_categorie')



// *** MIDDLEWARES ***//
const { auth } = require('./middleware/auth');
const { admin } = require('./middleware/admin');



// *** BRANDS ***//
// Createe a brand
app.post('/api/product/brand', auth, admin, (req, res) => {
    const brand = new Brand(req.body);

    brand.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        res.status(200).json({
            success: true,
            brand: doc
        });
    });
})  

// Get all brands
app.get('/api/product/get-brands', (req, res) => {
    Brand.find({}, (err, brands) => {
        if (err) return res.status(400).send(err);
        res.status(200).send(brands);
    })
})

// *** Clothes ***//
// Create a Product Categories
app.post('/api/product/create_productCategories', auth, admin, (req, res) => {
    const productCategories = new ProductCategories(req.body);

    productCategories.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        res.status(200).json({
            success: true,
            productCategories: doc
        });
    });
})

// Get all Product Categories
app.get('/api/product/all_productCategories', (req, res) => {
    ProductCategories.find({}, (err, productCategories) => {
        if (err) return res.status(400).send(err);
        res.status(200).send(productCategories);
    })
});

// *** PRODUCTS ***//
// Create a product
// admin,
app.post('/api/product/create_product', auth,  (req, res) => {
    const product = new Product(req.body);

    product.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        res.status(200).json({
            success: true,
            product: doc
        });
    });
});

// Get all products
app.get('/api/product/all_products', (req, res) => {
    Product.find({}, (err, products) => {
        if (err) return res.status(400).send(err);
        res.status(200).send(products);
    })
});

// Get single product

// *** USERS ***//

// Authenticate user
app.get('/api/users/auth', auth, (req, res) => {
    res.status(200).json({
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        cart: req.user.cart,
        history: req.user.history
    });
})
// Register User
app.post('/api/users/register', (req, res) => {
    const user = new User(req.body);

    user.save((err, doc) => {
        if(err) {
            return res.json({success: false, err})
        };

        res.status(200).json(
            {
                success: true,
                // userdata: doc,
            }
        )


    });
    // res.status(200);
}); 

// LOGIN USER
app.post("/api/users/login", (req, res) => {
    // find the email address if it exist in the database
    User.findOne({ 'email': req.body.email }, (err, user) => {
        if(!user) {
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            });
        }

        // check user password if it matches the password in the database
        user.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch) {
                return res.json({
                    loginSuccess: false,
                    message: "Wrong password"
                });
            }

            // if it does, generate a token and send it back to the user
            user.generateToken((err, user) => {
                if(err) {
                    return res.status(400).send(err);
                }

                // set the cookie
                // **the name and the value of the cookie**
                res.cookie("w_auth", user.token).status(200).json({
                    loginSuccess: true
                });
            });
        });
    });
})


// LOGOUT USER
app.get('/api/users/logout', auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, doc) => {
        if(err) {
            return res.json({success: false, err});
        }
        return res.status(200).send({
            success: true
        });
    });
})



// const cors = require('cors');

// const config = require('./server/config/config');

const port = process.env.PORT || 3002;
app.listen(port, () => console.log(`server Running at ${port}`));
require('dotenv').config()

const mongoose = require('mongoose');
const express = require('express')
const app = express()
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const categoryRoute = require('./routes/category');
const productRoute = require('./routes/products');
const orderRoute = require('./routes/order');



mongoose.connect(process.env.DATABASE, 
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useCreateIndex: true
    }).then( () => {
        console.log("DB CONNECTED");
        
});

app.use(cookieParser());
app.use(cors());
app.use(bodyParser());

app.use('/api', authRoute);
app.use('/api', userRoute);
app.use('/api', categoryRoute);
app.use('/api', productRoute);
app.use('/api', orderRoute);

const port = process.env.PORT || 8000;

app.listen(port, () =>  console.log(`Server running on port ${port} 🔥`));

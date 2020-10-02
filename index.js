//It's from (expressjs) by searching in google
const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');

//It's from (dotenv npm) by searching in google
require('dotenv').config();

//It's from (monogodb.com/Clusters/CONNECT) by searching in google
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tdo9r.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// console.log(process.env.DB_NAME);

//It's from by searching in google
//It's from (expressjs) by searching in google
const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = 3001

app.get('/', (req, res) => {
    res.send("Hello Ema-John-MongoDB! It's Working After Deploying Heroku...")
})

//It's from (monogodb.com/Clusters/CONNECT) by searching in google
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("EmaJohnStore").collection("products");
  const ordersCollection = client.db("EmaJohnStore").collection("orders");

  // perform actions on the collection object
  // console.log('database connected successfully');
    // Create data..
    // req.body er modhde thaka data pawer jonno obosshoi upore bodyParser & cors ta require kore nite hobe...&& app.use(bodyParser()); app.use(cors) ei 4 ta declare kore nite hobe...
    app.post('/addProduct', (req,res) => {
        const products = req.body; 
        // console.log(products);
        // productsCollection.insertMany(products)
        productsCollection.insertOne(products)
        .then(result => {
            console.log(result);
            res.send(result);
        })

    })
    
    app.post('/productsByKeys', (req, res) => {
        const productKeys = req.body;
        productsCollection.find({key: { $in: productKeys}})
        .toArray( (err, documents) => {
            res.send(documents);
        })
    })
    
    // Read Data..from -> localhost:3001/products...
    app.get('/products', (req, res) =>{
        productsCollection.find({})
        .toArray( (err, documents) => {
            res.send(documents);
        })
    })
    
    app.get('/product/:key', (req, res) =>{
        productsCollection.find({key: req.params.key})
        .toArray( (err, documents) => {
            res.send(documents[0]);
        })
    })
    
    app.post('/addOrder', (req,res) => {
        const order = req.body; 
        // console.log(orders);
        // productsCollection.insertMany(orders)
        ordersCollection.insertOne(order)
        .then(result => {
            // console.log(result.ops);
            // console.log(result.insertedCount);
            res.send(result.insertedCount > 0);
        })

    })
});

app.listen(process.env.PORT || port);
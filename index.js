const express = require('express');

//cors
const cors = require('cors');
//mongoDb
const { MongoClient } = require('mongodb');
//obj id
const ObjectId = require('mongodb').ObjectId;
//dot env
require('dotenv').config()


const app = express()
const port = process.env.PORT || 7000;

//MiddleWare
app.use(cors());
app.use(express.json());

//====
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.i3fcr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect()
        const database = client.db('fan_products');
        const productCollection = database.collection('products');
        //for order
        const orderCollection = database.collection('orders');
        //reviews collection
        const reviewCollection = database.collection('reviews');

        //Get products fan API
        app.get('/products', async (req, res) => {
            const cursor = await productCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        });

        //Get Single product load
        app.get('/products/:id', async (req, res) => {
            const id = req.params?.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const product = await productCollection.findOne(query);
            console.log(product);
            res.json(product);
        });

        // POST
        app.post('/products', async (req, res) => {
            const product = await req.body;
            console.log('hit the post', product);
            const result = await productCollection.insertOne(product);
            console.log(result)
            res.json(result)
        });
        //GET 
        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        });
        // POST for Order
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.json(result);
        });

        //single user order
        app.get('/orders/:email', async (req, res) => {
            const query = { email: req.params.email };
            console.log(query);
            const result = await orderCollection.find(query).toArray();
            res.json(result);
        })
        //For review
        app.get('/reviews', async (req, res) => {
            const cursor = reviewCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews);
        })
        //For review
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            console.log(review);
            const result = await reviewCollection.insertOne(review);
            res.json(result);
        })

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);


//===============
app.get('/', (req, res) => {
    res.send('Niche Product server Running')
})

app.listen(port, () => {
    console.log('Niche product port', port)
})
const express = require('express');

//cors
const cors = require('cors');
//mongoDb
const { MongoClient } = require('mongodb');
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
        console.log('Database Connected Successfully')
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir)
//===============
app.get('/', (req, res) => {
    res.send('Niche Product server Running')
})

app.listen(port, () => {
    console.log('Niche product port', port)
})
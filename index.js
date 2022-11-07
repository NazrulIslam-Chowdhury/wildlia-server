const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

// middleware
app.use(cors());
app.use(express.json());


const { response } = require('express');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hnlrj23.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {

    try {
        const servicesCollection = client.db('wildliaData').collection('services');
        app.get('/services', async (req, res) => {
            const query = {};
            const servicesData = await servicesCollection.find(query).toArray();
            res.send(servicesData);
        })
    }
    finally {

    }
}

run().catch(err => console.error(err));

app.get('/', (req, res) => {
    res.send('Wildlia server is running')
})

app.listen(port, () => {
    console.log(`Wildlia server is running on port ${port}`)
})
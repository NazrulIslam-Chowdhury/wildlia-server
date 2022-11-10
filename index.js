const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

// middleware
app.use(cors());
app.use(express.json());


// const { response } = require('express');
// const uri = `mongodb+srv://$:@cluster0.hnlrj23.mongodb.net/?retryWrites=true&w=majority`;



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hnlrj23.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {

    try {
        const servicesCollection = client.db('wildliaData').collection
            ('services');
        const reviewsCollection = client.db('wildliaData').collection('reviews');
        app.get('/services', async (req, res) => {
            const query = {};
            const servicesData = await servicesCollection.find(query).toArray();
            res.send(servicesData);
        })
        app.get('/services-limit', async (req, res) => {
            const query = {};
            const limitedServicesData = await servicesCollection.find(query).limit(3).toArray();

            res.send(limitedServicesData);
        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.send(service);
        })

        // reviews api
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewsCollection.insertOne(review);

            res.send(result);
        })

        app.get('/reviews', async (req, res) => {
            const query = {};
            const reviewData = await reviewsCollection.find(query).sort({ $natural: -1 }).limit(6).toArray();
            res.send(reviewData);

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
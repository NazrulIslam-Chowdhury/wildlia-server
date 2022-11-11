const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

// middleware
app.use(cors({
    origin: 'http://localhost:3000'
}));
app.use(express.json());


// 
// const uri = `mongodb+srv://$:@cluster0.hnlrj23.mongodb.net/?retryWrites=true&w=majority`;


const { response } = require('express');
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
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await servicesCollection.insertOne(service);
            res.send(result);
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
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const reviewData = await reviewsCollection.find(query).sort({ $natural: -1 }).toArray();
            res.send(reviewData);

        })
        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewsCollection.deleteOne(query);
            res.send(result);
        })
        app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewsCollection.findOne(query);
            res.send(result);
        })

        app.put('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const updatedReview = req.body;
            const option = { upsert: true };
            const updatedDoc = {
                $set: {
                    comment: updatedReview.newComment
                }
            }
            const result = await reviewsCollection.updateOne(filter, updatedDoc, option)
            res.send(result);
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
const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const uri = "mongodb+srv://firstCrud:12345ohidul@cluster0.past8.mongodb.net/firstCrud?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// get index.html file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


// database connected
client.connect(err => {
    const collection = client.db("firstCrud").collection("data");

    // post
    app.post('/addProduct', (req, res) => {
        const product = req.body;
        collection.insertOne(product)
            .then(result => {
                res.redirect('/');
            })
    });

    // get
    app.get('/products', (req, res) => {
        collection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    });

    // update
    app.get('/product/:id', (req, res) => {
        collection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })

    app.patch('/update/:id', (req, res) => {
        collection.updateOne({ _id: ObjectId(req.params.id) }, {
            $set: { price: req.body.price, quantity: req.body.quantity }
        })
            .then(result => {
                res.send(result.modifiedCount > 0);
            })
    })

    // delete
    app.delete('/delete/:id', (req, res) => {
        collection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                res.send(result.deletedCount > 0);
            })
    });
});

app.listen(3000);
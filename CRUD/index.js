const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const uri = "mongodb+srv://firstPractice:firstPractice@cluster0.past8.mongodb.net/firstPractice?retryWrites=true&w=majority";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("firstPractice").collection("products");

  // read - get
  app.get('/products', (req, res) => {
    collection.find({})
      .toArray((err, docs) => {
        res.send(docs);
      })
  });

  // read silgel product - get - for update
  app.get('/product/:id', (req, res) => {
    collection.find({ _id: ObjectId(req.params.id) })
      .toArray((err, docs) => {
        res.send(docs[0]);
      });
  });

  // update product - PATCH
  app.patch('/update/:id', (req, res) => {
    collection.updateOne({ _id: ObjectId(req.params.id) },
      {
        $set: { price: req.body.price, quantity: req.body.quantity }
      })
      .then(result => {
        res.send(result.modifiedCount > 0);
      })
  });

  // create - Post
  app.post('/addProduct', (req, res) => {
    const product = req.body;
    collection.insertOne(product)
      .then(result => {
        // res.send('send product success');
        res.redirect('/');
      });
  });

  // delete
  app.delete('/delete/:id', (req, res) => {
    collection.deleteOne({ _id: ObjectId(req.params.id) })
      .then(result => {
        res.send(result.deletedCount > 0);
      });
  });
});

app.listen(3000);
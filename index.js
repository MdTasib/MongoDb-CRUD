const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

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
                console.log('data added successfully');
                res.send('Success');
            })
    });

    // get
    app.get('/products', (req, res) => {
        collection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    });
});

app.listen(3000);
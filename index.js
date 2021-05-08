const express = require('express');
const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://firstCrud:12345ohidul@cluster0.past8.mongodb.net/firstCrud?retryWrites=true&w=majority";

const app = express();


app.get('/', (req, res) => {
    res.send('working');
});


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const collection = client.db("firstCrud").collection("data");
    console.log('Database connected successfully');
    client.close();
});

app.listen(3000);
const express = require('express');
const app = express()
const port = 5000
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://beckia:1704misun!@boilerplate.bffjl.mongodb.net/boilerplate?retryWrites=true&w=majority',{
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('mongoDB Connected..'))
    .catch(err => console.log(err))
app.get('/', (req,res) => res.send('Hello World!'))

app.listen(port, () => console.log(`example app listening on port ${port}!`))

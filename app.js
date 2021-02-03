require('dotenv').config();
const express = require('express');
const { urlencoded, json } = require('body-parser');
const mongoose = require('mongoose');
const router = require('./routes/router');

const app = express();
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(router);

const mongoDb = process.env.DB_KEY;
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Mongo connection error'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
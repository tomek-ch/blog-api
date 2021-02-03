require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();

const mongoDb = process.env.DB_KEY;
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Mongo connection error'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
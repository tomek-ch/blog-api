require('dotenv').config();
const express = require('express');
const { urlencoded, json } = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const router = require('./routes/router');
require('./passport');

const app = express();
app.use(cors({
    origin: 'http://localhost:3000',
}));
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(router);

mongoose.set('useFindAndModify', false);
const mongoDb = process.env.DB_KEY;
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Mongo connection error'));

app.use((err, req, res, next) => {
    res.sendStatus(500);
});

app.use((req, res, next) => res.sendStatus(404));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));
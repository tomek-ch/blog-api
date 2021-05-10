require('dotenv').config();
const express = require('express');
const { urlencoded, json } = require('body-parser');
const cors = require('cors');
const router = require('./routes/router');
require('./config/passport');
require('./config/mongoose');
const helmet = require('helmet');

const app = express();
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? 'https://blogg-nine.vercel.app' : 'http://localhost:3000',
}));
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(helmet());
app.use(router);

app.use((err, req, res, next) => {
    console.log(err);
    return res.sendStatus(500);
});

app.use((req, res, next) => res.sendStatus(404));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));
require('dotenv').config();
const express = require('express');
const { urlencoded, json } = require('body-parser');
const cors = require('cors');
const router = require('./routes/router');
require('./config/passport');
require('./config/mongoose');

const app = express();
app.use(cors({
    origin: 'http://localhost:3000',
}));
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(router);

app.use((err, req, res, next) => {
    res.sendStatus(500);
});

app.use((req, res, next) => res.sendStatus(404));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));
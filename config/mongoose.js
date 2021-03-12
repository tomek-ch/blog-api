const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);
const mongoDb = process.env.DB_KEY;
mongoose.connect(mongoDb, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    ignoreUndefined: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Mongo connection error'));
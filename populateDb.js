const User = require('./models/User');
const Post = require('./models/Post');
const bcrypt = require('bcryptjs');

const userArgs = process.argv.slice(2);

const mongoose = require('mongoose');
const mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

async function populateDb() {

    const user = new User({
        firstName: 'Tomek',
        lastName: 'Ch',
        description: 'hej wszyscy',
        password: await bcrypt.hash('123', 10),
        username: 'tomaszotronixx',
    });

    const post = new Post({
        title: 'Jak wytresować kota',
        timestamp: Date.now(),
        author: user,
        tags: ['koty', 'zwierzęta domowe', 'tresura'],
        paragraphs: [
            {
                heading: 'Krok pierwszy - poznaj swojego kota',
                body: 'Aby być w stanie wpłynąć na swojego pupila musisz wpierw poznać go dobrze.',
            },
            {
                heading: 'Krok drugi - zaprzyjaźnijcie się',
                body: 'Sama znajomość nie wystarczy. Musicie się lubić.',
            },
        ],
        isPublished: true,
    });

    await Promise.all([user.save(), post.save()]);

    mongoose.connection.close();
    console.log('Done!');
}

populateDb();

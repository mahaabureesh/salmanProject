const mongoose = require('mongoose');
var url = 'mongodb+srv://maha:12345678mh@cluster0.9ssxq.mongodb.net/usersInfo';
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected successfully to MongoDB!'))
    .catch(err => console.error('Something went wrong', err));


const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const usersRouter = require('./routes/users');
const adminRouter = require('./routes/admins');


const { PORT = 3000 } = process.env;

app.use(bodyParser.json())

mongoose.connect('mongodb://localhost:27017/mydb', {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', usersRouter);
app.use('/', adminRouter);


app.listen(PORT, () => {
	console.log(`App listening on port ${PORT}`)
});

// Required dependencies
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();

//App Config
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(methodOverride('_method'));

// Routes
app.get('/', (req, res) => {
	res.render('index');
});

const port = process.env.PORT || 3000;

app.listen(port, function() {
	console.log(`Server Started on port: ${port}`);
});

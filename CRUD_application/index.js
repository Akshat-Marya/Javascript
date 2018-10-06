//input validation module
//npm i joi

const Joi = require('joi');





//in the command prompt write the two following commands to install express, before doing anything here.
//npm init --yes
//npm i express

const express = require('express');
const app = express();

app.use(express.json());// this is not enabled by default, it is used to enable json object parsing.

//an array of the available courses.
const courses = [
	{id: 1, name: 'course1'},
	{id: 2, name: 'course2'},
	{id: 3, name: 'course3'},
];

//we have 
//app.get()/post()/put()/delete()

//app.get~~~~~~~~~~~~~
app.get('/',(req, res) => {// the second argument, a callback function is also called route handler.
	res.send('Hello world!!!');
});

app.get('/api/courses', (req, res) => {// a new route
	res.send(courses);
});

app.get('/api/courses/:id',(req, res) => { //getting parameter value fromt the url
	//res.send(req.params.id);
	const course = courses.find(c => c.id === parseInt(req.params.id));// .find() is a global function, it takes a function argument, which has to return a boolean value, so we use the "=>" sign to make a function c that returns true when the id of the param matches the id of the object.
	if (!course) res.status(404).send('The course with the given id was not found'); //404
	res.send(course);
});

app.get('/api/posts/:year/:month',(req, res) =>{ //how to get querystring value from the parameters in url
	res.send(req.query);
});





//app.post~~~~~~~~~~~~~
app.post('/api/courses', (req, res) => { // we are trying to take the input from url, and add that parameter as another key value pair in the courses variable.
//input validation.
/*	if(!req.body.name || req.body.name.length <3){
		// 400 Bad Request
		res.status(400).send('name is required and should be minimum 3 characters');
		return;
	} */

	//after installing joi
	const schema = {// schema defines what all info we need in what format.
		name: Joi.string().min(3).required()
	};
	const result = Joi.validate(req.body, schema);// if the req body matches the schema

	if(result.error){
		// 400 Bad Request
		res.status(400).send(result.error.details[0].message);// result.error is too complex to understand to the user, so we go into the details array, and find the message and print that. We could have also concatenated all the name and strings together to show to the user.
		return;
	}
	const course = {// define new const
		id: courses.length + 1,
		name: req.body.name
	};

	courses.push(course);
	res.send(course);
});




//app.put~~~~~~~~~~~~~
app.put('/api/courses/:id', (req,res) => {
	// Look up the course
	//if doesnt exist, return 404
	const course = courses.find(c => c.id === parseInt(req.params.id));// .find() is a global function, it takes a function argument, which has to return a boolean value, so we use the "=>" sign to make a function c that returns true when the id of the param matches the id of the object.
	if (!course) {return res.status(404).send('The course with the given id was not found')}; //404

	//validate course
	//if invalid, return 400 - Bad request
	const { error } = validateCourse(req.body); //equivalent to getting result.error
	if(error){
		// 400 Bad Request
		res.status(400).send(result.error.details[0].message);// result.error is too complex to understand to the user, so we go into the details array, and find the message and print that. We could have also concatenated all the name and strings together to show to the user.
		return;
	}
	//update the course
	course.name = req.body.name;
	//return update course
	res.send(course);
});


function validateCourse(course){
	const schema = {// schema defines what all info we need in what format.
	name: Joi.string().min(3).required()
	};
	return Joi.validate(course, schema);// if the req body matches the schema

};


//app.delete~~~~~~~~~~~~~
app.delete('/api/courses/:id',(req, res) =>{
	//look up the course, if its doesnt exist return 4040
	const course = courses.find(c => c.id === parseInt(req.params.id));// .find() is a global function, it takes a function argument, which has to return a boolean value, so we use the "=>" sign to make a function c that returns true when the id of the param matches the id of the object.
	if (!course) return res.status(404).send('The course with the given id was not found'); //404

	//delete
	const index = courses.indexOf(course);
	courses.splice(index, 1);
	//return the same course
	res.send(course);
});




app.listen(3000, () => console.log('listening on port 3000...'));

//install nodemon package...
//npm i -g nodemon
//automatically restarts when any changes are made in any file.


//a better way to do all the stuff above is to allow dynamic port selection, as that is based on the browser..
//so, instead of 3000, it should be a variable, that dynamically updates itself.

// we can use enviornment variable to do the trick.
// PORT is an enviornment variable, its value is set outside the application.
// we have global object called process...
//const port = process.env.PORT || 3000;
//app.listen(port, () => console.log('listening on port 3000...'));
// to sent PORT environment variable use the command prompt.
// export PORT=5000
//nodemon index.js


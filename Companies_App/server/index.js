const bodyParser = require('body-parser');
const express = require('express');
var routes = require("./routes.js");
const cors = require('cors');

const app = express();

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* ---------------------------------------------------------------- */
/* ------------------- Route handler registration ----------------- */
/* ---------------------------------------------------------------- */

/* ----- Find Companies ----- */
/* all companies */
app.get('/companies', routes.getAllCompanies);
app.get('/companies/:name', routes.getCompanies); 
app.get('/companypage/:name', routes.getCompanyPage); 
app.get('/companyInfo/:id', routes.company);
app.get('/companypos/:role', routes.companypos);
app.get('/companyopening/:role', routes.companyopening);
app.get('/jobopenings/', routes.jobopenings);
/* Complex query: get senior management of a company */
app.get('/companyceo/:id', routes.companyceo);



/* ---- Find Jobs ---- */
app.get('/jobs', routes.getAllJobs);
app.get('/jobs/:title', routes.getJobs);
app.get('/jobFromId/:id', routes.getJobFromID);
app.get('/jobsSimilar/:job_id', routes.getSimilarJobs);
app.get('/estimatedSalary/:job_id', routes.getEstimatedSalary);
/* Complex - get jobs posted by companies where all workers are not remote */
app.get('/getNoRemoteJobs/:title', routes.getNoRemoteJobs);



/* ---- Find Employees ---- */
app.get('/employees', routes.getAllEmployees);
app.get('/employees/:name', routes.getEmployees);
app.get('/employeeFromId/:id', routes.getEmployeeFromID);
/* Complex query: employeesSimilar gets employees that are up to 3 degrees away on a graph, where an edge is worksAbove, worksUnder, or same role */
app.get('/employeesSimilar/:employee_id', routes.getSimilarEmployees);
/* Complex Query: openJobSameTitle gets the highest paying opening with the same role as the given employee_id */
app.get('/openJobSameTitle/:id', routes.openJobSameTitle);

app.listen(8081, () => {
	console.log(`Server listening on PORT 8081`);
});
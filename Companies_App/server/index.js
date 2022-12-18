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

/* ---- (Dashboard) ---- */
// The route localhost:8081/companies is registered to the function
// routes.getAllCompanies, specified in routes.js.
app.get('/companies', routes.getAllCompanies);

/* ---- Part 3 (FindCompanies) ---- */
// TODO: (2) - Add route '/companies/:name' for the functionality of FindCompanies page 
app.get('/companies/:name', routes.getCompanies); // Hint: Replace () => {} with the appropriate route handler in routes.js.

/* ---- Part 3 (companypage) ---- */
// TODO: (2) - Add route '/companies/:name' for the functionality of FindCompanies page 
app.get('/companypage/:name', routes.getCompanyPage); // Hint: Replace () => {} with the appropriate route handler in routes.js.

/* ---- Part 4 (FindJobs) ---- */
app.get('/jobs', routes.getAllJobs);
app.get('/jobs/:title', routes.getJobs);
app.get('/jobFromId/:id', routes.getJobFromID);
app.get('/jobsSimilar/:job_id', routes.getSimilarJobs);
app.get('/estimatedSalary/:job_id', routes.getEstimatedSalary);
app.get('/getNoRemoteJobs/:title', routes.getNoRemoteJobs);


/* company roles */
app.get('/companypos/:role', routes.companypos);

/* company openings */
app.get('/companyopening/:role', routes.companyopening);

/* job openings */
//app.get('/jobopenings/?Location=:location&Salary=:salary', routes.jobopenings);
app.get('/jobopenings/', routes.jobopenings);

/* company info */
app.get('/companyInfo/:id', routes.company);

/* company ceo */
app.get('/companyceo/:id', routes.companyceo);

app.get('/employees', routes.getAllEmployees);
app.get('/employees/:name', routes.getEmployees);
app.get('/employeeFromId/:id', routes.getEmployeeFromID);
app.get('/employeesSimilar/:employee_id', routes.getSimilarEmployees);
app.get('/openJobSameTitle/:id', routes.openJobSameTitle);

app.listen(8081, () => {
	console.log(`Server listening on PORT 8081`);
});
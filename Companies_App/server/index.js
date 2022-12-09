const bodyParser = require('body-parser');
const express = require('express');
var routes = require("./routes.js");
const cors = require('cors');

const app = express();

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

/* ---------------------------------------------------------------- */
/* ------------------- Route handler registration ----------------- */
/* ---------------------------------------------------------------- */

/* ---- (Dashboard) ---- */
// The route localhost:8081/companies is registered to the function
// routes.getAllCompanies, specified in routes.js.
app.get('/companies', routes.getAllCompanies);

/* ---- Part 2 (FindFriends) ---- */
// TODO: (2) - Add route '/friends/:login' for the functionality of FindFriends page 
app.get('/friends/:login', routes.getFriends); // Hint: Replace () => {} with the appropriate route handler in routes.js.

/* ---- Part 3 (FindCompanies) ---- */
// TODO: (2) - Add route '/companies/:name' for the functionality of FindCompanies page 
app.get('/companies/:name', routes.getCompanies); // Hint: Replace () => {} with the appropriate route handler in routes.js.

/* ---- Part 3 (companypage) ---- */
// TODO: (2) - Add route '/companies/:name' for the functionality of FindCompanies page 
app.get('/companypage/:name', routes.getCompanyPage); // Hint: Replace () => {} with the appropriate route handler in routes.js.

app.listen(8081, () => {
	console.log(`Server listening on PORT 8081`);
});
var config = require('./db-config.js');
var mysql = require('mysql');

config.connectionLimit = 10;
var connection = mysql.createPool(config);

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */

/* ---- (Dashboard) ---- */
function getAllCompanies(req, res) {
  var query = `
  SELECT CompanyName, city, state
  FROM TO_companies
`;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

/* ---- Part 3 (FindCompanies) ---- */
function getCompanies(req, res) {
  var inputSearch = req.params.name;

  // TODO: (3) - Edit query below
  var query = `
    SELECT CompanyName, city, state
    FROM TO_companies
    WHERE companyName LIKE "${inputSearch}"
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
};

/* ---- Part 4 (companypage) ---- */
function getCompanyPage(req, res) {
  var inputSearch = req.params.name;

  var query = `
    SELECT CompanyName, city, state
    FROM TO_companies
    WHERE companyName LIKE "${inputSearch}"
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
};

/* ---- Part 5 (find Jobs Page) ---- */
function getJobs(req, res) {
  var inputSearch = req.params.name;

  var query = `
    SELECT id AS id, employer_name AS Company, job_name AS JobName
    FROM HS_Jobs
    WHERE companyName LIKE "${inputSearch}"
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
};


function getAllEmployees(req, res) {
  var query = `SELECT employee_id, employeeName, CompanyName, role 
              FROM TO_Employees 
              LIMIT 5`;
  
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

function getEmployees(req, res) {
  inputSearch = req.params.name;
  var query = `
    SELECT employee_id, employeeName, CompanyName, role
    FROM TO_Employees
    WHERE employeeName LIKE "%${inputSearch}%"
    LIMIT 5
  `;
  
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

function getEmployeeFromID(req, res) {
  inputSearch = req.params.id;
  var query = `
    SELECT employee_id, employeeName, CompanyName, role
    FROM TO_Employees
    WHERE employee_id= ${inputSearch}
  `;
  
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

function getSimilarEmployees(req, res) {
  var inputPerson = req.params.employee_id;
  console.log(`in routes.js/getSimilarEmployees. input = ${inputPerson}`)
  var query = `WITH desiredRole AS (
    SELECT role
    FROM TO_Employees
    WHERE employee_id = ${inputPerson}
    ),
    deg0 AS (
    SELECT employee_id
    FROM TO_Employees JOIN desiredRole d ON TO_Employees.role = d.role
    LIMIT 5
    ),
    deg1 AS (
        SELECT employee_id
        FROM (SELECT deg0.employee_id FROM worksUnder JOIN deg0 ON deg0.employee_id = worksUnder.parent_id) boss
        UNION (SELECT deg0.employee_id FROM worksUnder JOIN deg0 ON deg0.employee_id = worksUnder.employee_id)
        LIMIT 5
    ),
    deg2 AS (
        SELECT employee_id
        FROM (SELECT deg1.employee_id FROM worksUnder JOIN deg1 ON deg1.employee_id = worksUnder.parent_id) boss
        UNION (SELECT deg1.employee_id FROM worksUnder JOIN deg1 ON deg1.employee_id = worksUnder.employee_id)
        LIMIT 5
    ),
    alldegs AS (
            SELECT * FROM deg0
            UNION (SELECT * FROM deg1)
            UNION (SELECT * FROM deg2)
    )
SELECT employeeName
FROM TO_Employees
JOIN alldegs ON TO_Employees.employee_id = alldegs.employee_id
ORDER BY employeeName
LIMIT 5`;
  
  connection.query(query, function (error, results, fields) {
    if (error) {
        console.log(error)
        res.json({ error: error })
    } else if (results) {
      res.json({ results: results })
    }
  });
};

// The exported functions, which can be accessed in index.js.
module.exports = {
  getAllCompanies: getAllCompanies,
  getCompanies: getCompanies,
  getCompanyPage: getCompanyPage,
  getJobs: getJobs,

  getAllEmployees: getAllEmployees,
  getEmployees: getEmployees,
  getEmployeeFromID: getEmployeeFromID,
  getSimilarEmployees: getSimilarEmployees,

}
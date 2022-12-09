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

/* ---- Part 2 (FindFriends) ---- */
function getFriends(req, res) {
  var inputLogin = req.params.login;

  // TODO: (3) - Edit query below
  var query = `
    SELECT p.login, p.name
    FROM Friends f JOIN Person p ON f.friend = p.login
    WHERE f.login = "${inputLogin}"
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
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

// The exported functions, which can be accessed in index.js.
module.exports = {
  getAllCompanies: getAllCompanies,
  getFriends: getFriends,
  getCompanies: getCompanies,
  getCompanyPage: getCompanyPage
}
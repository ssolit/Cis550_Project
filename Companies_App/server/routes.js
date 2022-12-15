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
    WHERE employer_name LIKE "${inputSearch}"
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
};


/* --- query 1 --- */
function employeesubs(req, res) {
  var inputSearch = req.params.name;

  var query = `
    SELECT employee_id AS EId
    FROM TO_Employees JOIN worksUnder wU ON TO_Employees.employee_id = wU.employee_id
    WHERE parent_id = '%${inputSearch}%';
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
};

/* --- query 2 --- */
function companypos(req, res) {
  var inputSearch = req.params.name;

  var query = `
    SELECT company_id AS CId, CompanyName AS CName
    FROM to_employees
    WHERE role LIKE '%${inputSearch}%';
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
};

/* --- query 3 --- */
function companyopening(req, res) {
  var inputSearch = req.params.name;

  var query = `
    SELECT employer_name AS CName
    FROM handshake_jobs
    HERE job_name LIKE '%${inputSearch}%';
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
};

/* --- query 4 --- */
function company(req, res) {
  var inputSearch = req.params.name;

  var query = `
    SELECT company_id AS CId, CompanyName AS CName, twitterUrl AS Twitter, linkedInUrl AS Linkedin,
    facebookUrl AS Facebook, websiteUrl AS Website, city AS CCity, state AS CState, country AS CCountry,
    location AS CLocation, employeeSizeRange AS Size, description AS CDescription
    FROM to_companies
    WHERE companyName LIKE '%${inputSearch}%';
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
};

/* --- query 5 --- */
function jobopenings(req, res) {
  const Location = req.query.Location ? req.query.Location : '%%'
  const Salary = req.query.Salary ? req.query.Salary : 0

  var query = `
    WITH ExpSalaryTable AS (SELECT company, AVG(totalyearlycompensation) AS AvgSalary
    FROM Salary
    WHERE yearsofexperience < 5 AND city LIKE '%${Location}%'
    GROUP BY company
    HAVING AvgSalary > '%${Salary}%')
    SELECT employer_name AS CName, job_name AS JName
    FROM HS_Jobs
    JOIN ExpSalaryTable ON HS_Jobs.employer_name = ExpSalaryTable.company
    WHERE (location_cities_1 LIKE '%${Location}%'
    OR location_cities_2 LIKE '%${Location}%'
    OR location_cities_3 LIKE '%${Location}%'
    OR location_cities_4 LIKE '%${Location}%'
    OR location_cities_5 LIKE '%${Location}%');
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
};

/* --- query 6 --- */
function job(req, res) {
  //var inputSearch = req.params.name;
  const JName = req.query.JName ? req.query.JName : '%%'

  var query = `
    SELECT AVG(basesalary) AS Salary
    FROM Salary s
    JOIN HS_Jobs h ON h.employer_name = s.company
      AND h.job_name = s.title
    WHERE h.job_name LIKE '%${JName}%';
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
};

/* --- query 7 --- */
function companyceo(req, res) {
  //var inputSearch = req.params.name;
  const CName = req.query.CName ? req.query.CName : '%%'

  var query = `
    WITH CompanyCEO AS (
      SELECT employee_id
      FROM TO_Employees
      WHERE CompanyName LIKE '%${JName}%' AND role LIKE '%CEO%'
      ),
      Dof1 AS (
          SELECT worksUnder.employee_id
          FROM worksUnder
          JOIN CompanyCEO ON worksUnder.parent_id = CompanyCEO.employee_id
      ),
      Dof2 AS (
          SELECT worksUnder.employee_id
          FROM worksUnder
          JOIN Dof1 ON Dof1.employee_id = worksUnder.parent_id
      ),
      Dof3 AS (
          SELECT worksUnder.employee_id
          FROM worksUnder
          JOIN Dof2 ON Dof2.employee_id = worksUnder.parent_id
          ),
      AllDof3Employees AS (
          SELECT * FROM CompanyCEO
          UNION (SELECT * FROM Dof1)
          UNION (SELECT * FROM Dof2)
          UNION (SELECT * FROM Dof3)
      )
  SELECT employee_id AS EId, employeeName AS EName, role AS ERole, description AS EDescription
  FROM TO_Employees
  JOIN AllDof3Employees ON TO_Employees.employee_id = AllDof3Employees.employee_id;
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
};


/* --- query 8 --- */
function employeesimilar(req, res) {
  //var inputSearch = req.params.name;
  const ERole = req.query.ERole ? req.query.ERole : '%%'

  var query = `
    WITH deg0 AS (
      SELECT employee_id
      FROM TO_Employees
      WHERE role = '%${ERole}%'
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
    SELECT employee_id AS EId, employeeName AS EName, CompanyName AS CName, TO_Employees.role AS ERole, 
           roleAutoFunction AS ERoleFunction, TO_Employees.description AS EDescription
    FROM TO_Employees
    JOIN alldegs ON TO_Employees.employee_id = alldegs.employee_id
    ORDER BY employeeName
    LIMIT 5;
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
};

/* --- query 9 --- */
function companynotremote(req, res) {
  var query = `
    SELECT CompanyName AS CName
    FROM HS_Jobs
    WHERE employer_name NOT IN (
      SELECT CompanyName
      FROM TO_Employees
      WHERE remote = 0
    );
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
};

/* --- query 10 --- */
function jobsimilar(req, res) {
  var EId = req.params.name;
  //const EId = req.query.EId ? req.query.EId : '%%'

  var query = `
    WITH eq_role_postings AS (SELECT open_sals.role, job_id, salary, company
      FROM (SELECT *
            FROM (SELECT role
                  FROM TO_Employees
                  WHERE employee_id = ${EId}) employee_reduce
                    Natural JOIN
                  (SELECT Salary.title AS role, company, MAX(basesalary + bonus) AS salary
                  FROM Salary
                  GROUP BY title, company) sal_reduce) open_sals
            JOIN
            (SELECT HS_Jobs.title AS role, HS_Jobs.id AS job_id, employer_name
             FROM HS_Jobs) job_reduce
            ON company=employer_name AND open_sals.role=job_reduce.role
    )
    SELECT HS_Jobs.id AS JId, To_Employees.role AS ERole, Salary.baseSalary AS Salary, employer_name AS CName
    FROM eq_role_postings
    WHERE salary >= ALL (
    SELECT salary
    FROM eq_role_postings
    );
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
};





// employee functions


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
  SELECT employeeName, CompanyName, role, description, 
  CASE
    WHEN remote=0 THEN "No"
    WHEN remote=1 THEN "Yes"
    ELSE "Unknown"
  END AS remote
  FROM TO_Employees
  WHERE employee_id = ${inputSearch}
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
                SELECT TO_Employees.employee_id AS employee_id, employeeName, CompanyName, role
                FROM TO_Employees
                JOIN alldegs ON TO_Employees.employee_id = alldegs.employee_id
                ORDER BY employeeName
                LIMIT 5`;
  
  // connection.query(query, function (err, rows, fields) {
  //   if (err) console.log(err);
  //   else {
  //     res.json(rows);
  //   }
  // });
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
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

  employeesubs,
  companypos,
  companyopening,
  company,
  jobopenings,
  job,
  companyceo,
  employeesimilar,
  companynotremote,
  jobsimilar
}
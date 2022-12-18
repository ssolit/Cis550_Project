var config = require('./db-config.js');
var mysql = require('mysql');

config.connectionLimit = 10;
var connection = mysql.createPool(config);

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */

/* Company Queries */
function getAllCompanies(req, res) {
  var query = `
  SELECT CompanyName AS CName, city AS CCity, state AS CState
  FROM TO_companies
`;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

function getCompanies(req, res) {
  var inputSearch = req.params.name;
  var query = `
    SELECT company_id AS CId, CompanyName AS CName, city AS CCity, state AS CState, country AS CCountry,
    employeeSizeRange AS Size, description AS CDescription
    FROM TO_companies
    WHERE companyName LIKE "%${inputSearch}%"
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

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
      res.json(rows);
    }
  });
};

function company(req, res) {
  var inputSearch = req.params.id;

  var query = `
    SELECT company_id AS CId, CompanyName AS CName, city AS CCity, state AS CState, country AS CCountry,
    employeeSizeRange AS Size, description AS CDescription
    FROM TO_companies
    WHERE company_id = ${inputSearch};
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

function companypos(req, res) {
  var inputSearch = req.params.role;

  var query = `
    SELECT CompanyName AS CName, role AS Role
    FROM TO_Employees
    WHERE role LIKE '%${inputSearch}%';
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

function companyopening(req, res) {
  var inputSearch = req.params.role;

  var query = `
    SELECT employer_name AS CName, title AS Role, location_cities_1 AS CCity
    FROM HS_Jobs
    WHERE title LIKE '%${inputSearch}%';
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};


function jobopenings(req, res) {
  const Location = req.query.Location ? req.query.Location : ''
  const Salary = req.query.Salary ? req.query.Salary : 0

  var query = `
    WITH ExpSalaryTable AS (SELECT company, AVG(totalyearlycompensation) AS AvgSalary
      FROM Salary
      GROUP BY company
      HAVING AvgSalary > ${Salary})
    SELECT employer_name AS CName, title AS Role, '${Location}' AS CCity
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
      res.json(rows);
    }
  });
};


function companyceo(req, res) {
  var inputSearch = req.params.id;
  console.log("started ceo query on ")
  var query = `
  WITH CompanyCEO AS (
      SELECT employee_id
      FROM TO_Employees
      JOIN TO_companies ON TO_Employees.CompanyName = TO_companies.CompanyName
      WHERE TO_companies.company_id = ${inputSearch} AND TO_Employees.role LIKE '%CEO%'
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
          UNION ALL (SELECT * FROM Dof1)
          UNION ALL (SELECT * FROM Dof2)
          UNION ALL (SELECT * FROM Dof3)
      )
  SELECT DISTINCT employeeName AS Name, role AS Role, description AS Description
  FROM TO_Employees
  JOIN AllDof3Employees ON TO_Employees.employee_id = AllDof3Employees.employee_id; 
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};


/* Job Queries */






// job routes
function getAllJobs(req, res) {
  var query = `SELECT id, employer_name, title, 
              CASE
                  WHEN remote=0 THEN "No"
                  WHEN remote=1 THEN "Yes"
                  ELSE "Unknown"
              END AS remote
              FROM HS_Jobs
              ORDER BY employer_name 
              `;

  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

function getJobs(req, res) {
  inputSearch = req.params.title;
  var query = `
  SELECT id, employer_name, title, 
  CASE
    WHEN remote=0 THEN "No"
    WHEN remote=1 THEN "Yes"
    ELSE "Unknown"
  END AS remote
  FROM HS_Jobs
  WHERE title LIKE "%${inputSearch}%"
  `;

  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

function getJobFromID(req, res) {
  inputSearch = req.params.id;
  var query = `
  SELECT id, employer_name, title, text_description, 
  CASE
    WHEN remote=0 THEN "No"
    WHEN remote=1 THEN "Yes"
    ELSE "Unknown"
  END AS remote
  FROM HS_Jobs
  WHERE id LIKE "%${inputSearch}"
  `;

  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

function getSimilarJobs(req, res) {
  var inputJob = req.params.job_id;
  var query = `SELECT id, employer_name, title, text_description
  FROM HS_Jobs
  WHERE title IN (
      SELECT title
      FROM HS_Jobs
      WHERE id = ${inputJob}
  )`;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });

};

function getEstimatedSalary(req, res) {
  var inputJob = req.params.job_id;
  var query = `WITH get_title AS (
    SELECT title
    FROM HS_Jobs
    WHERE id=${inputJob}
    )
    SELECT AVG(basesalary) as estimatedSalary
    FROM Salary S JOIN get_title G ON S.title=G.title;`;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });

};

/* --- query 9 --- */
function getNoRemoteJobs(req, res) {
  var inputSearch = req.params.title;
  var query = `SELECT id, employer_name, title,
                CASE
                  WHEN remote=0 THEN "No"
                  WHEN remote=1 THEN "Yes"
                  ELSE "Unknown"
                END AS remote
              FROM HS_Jobs H
              WHERE H.employer_name NOT IN (
                  SELECT CompanyName
                  FROM TO_Employees
                  WHERE remote = 1
                  ) AND H.remote = 0
              AND H.title LIKE "%${inputSearch}%"
              ORDER BY employer_name;`;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });

};




// employee routes
function getAllEmployees(req, res) {
  var query = `SELECT employee_id, employeeName, CompanyName, role 
              FROM TO_Employees 
              `;

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
                      UNION ALL (SELECT deg0.employee_id FROM worksUnder JOIN deg0 ON deg0.employee_id = worksUnder.employee_id)
                      LIMIT 5
                  ),
                  deg2 AS (
                      SELECT employee_id
                      FROM (SELECT deg1.employee_id FROM worksUnder JOIN deg1 ON deg1.employee_id = worksUnder.parent_id) boss
                      UNION ALL (SELECT deg1.employee_id FROM worksUnder JOIN deg1 ON deg1.employee_id = worksUnder.employee_id)
                      LIMIT 5
                  ),
                  alldegs AS (
                          SELECT * FROM deg0
                          UNION ALL (SELECT * FROM deg1)
                          UNION ALL (SELECT * FROM deg2)
                  )
              SELECT DISTINCT (TO_Employees.employee_id) AS employee_id, employeeName, CompanyName, role
              FROM TO_Employees
              JOIN alldegs ON TO_Employees.employee_id = alldegs.employee_id
              ORDER BY employeeName
              LIMIT 5`;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });

};

/* --- query 10 --- */
function openJobSameTitle(req, res) {
  var EId = req.params.id;
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
    SELECT job_id, role, salary, company
    FROM eq_role_postings
    WHERE salary >= ALL (
    SELECT salary
    FROM eq_role_postings
    );
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      // console.log(rows);
      res.json(rows);
    }
  });
};



// function employeesubs(req, res) {
//   var inputSearch = req.params.name;

//   var query = `
//     SELECT employee_id AS EId
//     FROM TO_Employees JOIN worksUnder wU ON TO_Employees.employee_id = wU.employee_id
//     WHERE parent_id = '%${inputSearch}%';
//   `;
//   connection.query(query, function (err, rows, fields) {
//     if (err) console.log(err);
//     else {
//       console.log(rows);
//       res.json(rows);
//     }
//   });
// };

// function job(req, res) {
//   const JName = req.query.JName ? req.query.JName : '%%'

//   var query = `
//     SELECT AVG(basesalary) AS Salary
//     FROM Salary s
//     JOIN HS_Jobs h ON h.employer_name = s.company
//       AND h.job_name = s.title
//     WHERE h.job_name LIKE '%${JName}%';
//   `;
//   connection.query(query, function (err, rows, fields) {
//     if (err) console.log(err);
//     else {
//       console.log(rows);
//       res.json(rows);
//     }
//   });
// };


// function employeesimilar(req, res) {
//   //var inputSearch = req.params.name;
//   const ERole = req.query.ERole ? req.query.ERole : '%%'

//   var query = `
//     WITH deg0 AS (
//       SELECT employee_id
//       FROM TO_Employees
//       WHERE role = '%${ERole}%'
//       LIMIT 5
//       ),
//       deg1 AS (
//           SELECT employee_id
//           FROM (SELECT deg0.employee_id FROM worksUnder JOIN deg0 ON deg0.employee_id = worksUnder.parent_id) boss
//           UNION (SELECT deg0.employee_id FROM worksUnder JOIN deg0 ON deg0.employee_id = worksUnder.employee_id)
//           LIMIT 5
//       ),
//       deg2 AS (
//           SELECT employee_id
//           FROM (SELECT deg1.employee_id FROM worksUnder JOIN deg1 ON deg1.employee_id = worksUnder.parent_id) boss
//           UNION (SELECT deg1.employee_id FROM worksUnder JOIN deg1 ON deg1.employee_id = worksUnder.employee_id)
//           LIMIT 5
//       ),
//       alldegs AS (
//               SELECT * FROM deg0
//               UNION (SELECT * FROM deg1)
//               UNION (SELECT * FROM deg2)
//       )
//     SELECT employee_id AS EId, employeeName AS EName, CompanyName AS CName, TO_Employees.role AS ERole, 
//            roleAutoFunction AS ERoleFunction, TO_Employees.description AS EDescription
//     FROM TO_Employees
//     JOIN alldegs ON TO_Employees.employee_id = alldegs.employee_id
//     ORDER BY employeeName
//     LIMIT 5;
//   `;
//   connection.query(query, function (err, rows, fields) {
//     if (err) console.log(err);
//     else {
//       console.log(rows);
//       res.json(rows);
//     }
//   });
// };


// The exported functions, which can be accessed in index.js.
module.exports = {
  getAllCompanies: getAllCompanies,
  getCompanies: getCompanies,
  getCompanyPage: getCompanyPage,
  getAllEmployees: getAllEmployees,
  getEmployees: getEmployees,
  getEmployeeFromID: getEmployeeFromID,
  getSimilarEmployees: getSimilarEmployees,


  companypos,
  companyopening,
  company,
  jobopenings,
  companyceo,


  getAllJobs: getAllJobs,
  getJobs: getJobs,
  getJobFromID: getJobFromID,
  getSimilarJobs: getSimilarJobs,
  getEstimatedSalary: getEstimatedSalary,
  getNoRemoteJobs: getNoRemoteJobs,
  openJobSameTitle: openJobSameTitle,

}
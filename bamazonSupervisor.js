var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require("table");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "donkey",
  database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    ask();
});

function ask() {
  inquirer
    .prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "View Product Sales by Department",
            "Create New Department",
            "Exit"
        ]
    })
    .then(function(answer) {
        switch (answer.action) {
            case "View Product Sales by Department":
              viewSales();
              break;
      
            case "Create New Department":
              createDept();
              break;
      
            case "Exit":
              connection.end();
              break;
            }
    });
};

function viewSales() {
    var query = "SELECT department_id, departments.department_name, over_head_costs, SUM (product_sales) product_sales FROM departments INNER JOIN products ON products.department_name = departments.department_name GROUP BY department_id ORDER BY department_id;";
    connection.query(
        query, function(err, rows, fields) {
            if (err) throw err;
            else {
                console.log(
                    table([fields.map(f => chalk.bold(f.name))].concat(rows.map(r => r.map(c => util.inspect(c, { colors: true })))))
                  );
            }
        }
    );
    ask();
};

function createDept() {

};
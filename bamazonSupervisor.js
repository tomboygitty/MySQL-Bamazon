var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require("console.table");

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
    var query = "SELECT department_id, d.department_name, over_head_costs, SUM(product_sales) product_sales FROM departments d LEFT OUTER JOIN products p ON p.department_name = d.department_name UNION SELECT NULL AS department_id, department_name, NULL AS over_head_costs, SUM(product_sales) product_sales FROM products WHERE products.department_name NOT IN (SELECT department_name FROM departments) GROUP BY department_name ORDER BY -department_id DESC;";
    connection.query(
        query, function(err, res) {
            if (err) throw err;
            else {
                for (i = 0; i < res.length; i++) {
                    if (res[i].department_id === null) {
                        res[i].department_id = 'N/A';
                    }
                    if (res[i].over_head_costs === null) {
                        res[i].over_head_costs = 'N/A';
                        res[i].total_profit = 'N/A';
                    }
                    else {
                        res[i].total_profit = (res[i].product_sales - res[i].over_head_costs).toFixed(2);
                    }
                    if (res[i].product_sales === null) {
                        res[i].product_sales = 0;
                    }
                    res[i].product_sales = res[i].product_sales.toFixed(2);
                }
                console.table(res);
                ask();
            }
        }
    );
};

function createDept() {
    console.log("\nPlease enter the information of the department you want to add:\n");
    inquirer.prompt(
        [
            {   name: "name",
                type: "input",
                message: "Name of the department:",
            },
            {   name: "overhead",
                type: "input",
                message: "Total overhead costs of the department:",
                validate: function(value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ]
    ).then(function(answer) {
        if (parseInt(answer.overhead < 0.01)) {
            console.log("\nPlease enter a valid overhead cost for the department.\n");
            createDept();
        }
        else {
            connection.query(
                "INSERT INTO departments (department_name, over_head_costs) VALUES ('" + answer.name + "', " + answer.overhead + ");", function(err, res) {
                    if (err) throw err;
                    else {
                        console.log("\nDepartment added successfully!\n");
                        ask();
                    }
                }
            )
        }
    });
};
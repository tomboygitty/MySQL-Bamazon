// NPM requirements
var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

// Initialize MySQL connection
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});

// Start the MySQL connection
connection.connect(function(err) {
    if (err) throw err;
    ask();
});

// Inquirer prompt to ask which command to run
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
        // Switch case to call specific functions
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

// Function to display ID, Name, Overhead costs, and Total product sales for each Department
function viewSales() {
    // MySQL SELECT call to get the columns containing related department info
    var query = "SELECT department_id, d.department_name, over_head_costs, product_sales FROM departments d LEFT OUTER JOIN products p ON d.department_name = p.department_name WHERE d.department_name NOT IN (SELECT department_name FROM products) UNION SELECT department_id, p.department_name, over_head_costs, SUM(product_sales) product_sales FROM products p LEFT OUTER JOIN departments d ON d.department_name = p.department_name GROUP BY department_name ORDER BY -department_id DESC;";
    connection.query(
        query, function(err, res) {
            if (err) throw err;
            else {
                for (i = 0; i < res.length; i++) {
                    // Clean up display of departments that don't have full info
                    if (res[i].department_id === null) {
                        res[i].department_id = 'N/A';
                    }
                    if (res[i].over_head_costs === null) {
                        res[i].over_head_costs = 'N/A';
                        res[i].total_profit = 'N/A';
                    }
                    // Display total profit of each department as decimals to 2 digits
                    else {
                        res[i].total_profit = (res[i].product_sales - res[i].over_head_costs).toFixed(2);
                    }
                    if (res[i].product_sales === null) {
                        res[i].product_sales = 0;
                    }
                    // Display total product sales as decimals to 2 digits
                    res[i].product_sales = res[i].product_sales.toFixed(2);
                }
                // NPM console.table display the MySQL response array as a properyl formatted table
                console.table(res);
                ask();
            }
        }
    );
};

// Function to create a new Department in the inventory system
function createDept() {
    console.log("\nPlease enter the information of the department you want to add:\n");
    // Inquirer prompt to ask the info for the department to add
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
        // Validate the overhead cost input
        if (parseInt(answer.overhead < 0.01)) {
            console.log("\nPlease enter a valid overhead cost for the department.\n");
            createDept();
        }
        else {
            // MySQL INSERT INTO call to add the new department info to the database table
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
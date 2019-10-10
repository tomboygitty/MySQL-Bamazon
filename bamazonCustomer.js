var mysql = require("mysql");
var inquirer = require("inquirer");

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
    runStore();
});

function runStore() {
    display();
    ask();
};

function display() {
    connection.query(
        "SELECT item_id, item_name, price, stock_quantity FROM products;",
        function(err, res) {
            if (err) throw err;
            else {
                for (i = 0; i < res.length; i++) {
                    console.log(res[i].item_id + ") " + res[i].item_name + " | " + res[i].price + " | " + res[i].stock_quantity);
                }
                console.log("\n");
            }
        }
    )
};

function ask() {
  inquirer
    .prompt({
        name: "id",
        type: "input",
        message: "Please give the ID of the item you would like to purchase:",
        validate: function(value) {
            if (isNaN(value) === false) {
                return true;
            }
            return false;
        }
    })
    .then(function(answer1) {
        if (answer1.id < 1 || answer1.id > 10) {
            console.log("Please give a proper input.\n");
            runStore();
        }
        else {
            inquirer.prompt({
                name: "quantity",
                type: "input",
                message: "How many of this item would you like to purchase:",
                validate: function(value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            })
            .then(function(answer2) {
                connection.query(
                    "SELECT * FROM products WHERE ?", { item_id: answer1.id }, function(err, res) {
                        if (err) throw err;
                        else {
                            if (res[0].stock_quantity < parseInt(answer2.quantity)) {
                                console.log("Insufficient quantity. Please order an appropriate amount.\n");
                                runStore();
                            }
                            else {
                                connection.end();
                            }
                        }
                    }
                )
            });
        }
    });
};
var mysql = require("mysql");
var inquirer = require("inquirer");
var numItems;

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
    connection.query(
        "SELECT item_id, item_name, price FROM products;",
        function(err, res) {
            if (err) throw err;
            else {
                numItems = res.length;
                for (i = 0; i < res.length; i++) {
                    console.log(res[i].item_id + ") " + res[i].item_name + " | $" + res[i].price);
                }
                console.log("\n0) Exit\n");
                ask();
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
        if (answer1.id < 0 || answer1.id > numItems) {
            console.log("\nPlease give a proper input.\n");
            runStore();
        }
        else if (answer1.id == 0) {
            connection.end();
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
                                console.log("\nInsufficient quantity. Please order an smaller amount.\n");
                                runStore(ask);
                            }
                            else {
                                var total = parseInt(answer2.quantity) * res[0].price;
                                connection.query(
                                    "UPDATE products SET ? WHERE ?",
                                    [   
                                        { stock_quantity: res[0].stock_quantity - parseInt(answer2.quantity), product_sales: total
                                        },
                                        { item_id: answer1.id
                                        }
                                    ],
                                    function(err, res) {
                                        if (err) throw err;
                                        else {
                                            console.log("\nThe total cost for your order is $" + total.toFixed(2) + ".\n\nWould you like to order more?\n");
                                        }
                                    }
                                );
                                runStore(ask);
                            }
                        }
                    }
                )
            });
        }
    });
};
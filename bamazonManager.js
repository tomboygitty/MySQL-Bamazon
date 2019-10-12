var mysql = require("mysql");
var inquirer = require("inquirer");

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
            "View Products for Sale",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product",
            "Exit"
        ]
    })
    .then(function(answer) {
        switch (answer.action) {
            case "View Products for Sale":
              viewProducts();
              break;
      
            case "View Low Inventory":
              lowInventory();
              break;
      
            case "Add to Inventory":
              addInventory();
              break;
      
            case "Add New Product":
              addProduct();
              break;
      
            case "Exit":
              connection.end();
              break;
            }
    });
};

function viewProducts() {
    connection.query(
        "SELECT item_id, item_name, price, stock_quantity FROM products", function(err, res) {
            if (err) throw err;
            else {
                console.log("\n");
                for (i = 0; i < res.length; i++) {
                    console.log(res[i].item_id + ") " + res[i].item_name + " | $" + res[i].price + " | " + res[i].stock_quantity);
                }
                ask();
            }
        }
    );
};

function lowInventory() {
    console.log("The following items have a quantity lower than 5:\n");
    connection.query(
        "SELECT item_name, stock_quantity FROM products WHERE stock_quantity < 5", function (err, res) {
            if (err) throw err;
            else {
                console.log("\n");
                for (i = 0; i < res.length; i++) {
                    console.log(res[i].item_name + " | " + res[i].stock_quantity);
                }
                console.log("\n");
                ask();
            }
        }
    );
};

function addInventory() {
    var quants = [];
    connection.query(
        "SELECT item_id, item_name, stock_quantity FROM products", function (err, res) {
            if (err) throw err;
            else {
                for (i = 0; i < res.length; i++) {
                    console.log(res[i].item_id + " | " + res[i].item_name + " | " + res[i].stock_quantity);
                    quants.push(parseInt(res[i].stock_quantity));
                }
                console.log("\n");
                inquirer.prompt({
                    name: "id",
                    type: "input",
                    message: "Please give the ID of the item you want to add quantity to:",
                    validate: function(value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    }
                }).then(function(answer1) {
                    if (answer1.id < 0 || answer1.id > 10) {
                        console.log("\nPlease give a proper input.\n");
                        ask();
                    }
                    else {
                        inquirer.prompt({
                            name: "quantity",
                            type: "input",
                            message: "Please give the quantity you want to add:",
                            validate: function(value) {
                                if (isNaN(value) === false) {
                                    return true;
                                }
                                return false;
                            }
                        }).then(function(answer2) {
                            connection.query(
                                "UPDATE products SET ? WHERE ?", [{ stock_quantity: parseInt(answer2.quantity) + quants[answer1.id-1] }, { item_id: answer1.id }], function (err, res) {
                                    if (err) throw err;
                                    else {
                                        console.log("\nQuantity updated!\n");
                                        ask();
                                    }
                                }
                            );
                        });
                    }
                });
            }
        }
    );
};

function addProduct() {
    console.log("\nPlease enter the information of the product you want to add:\n");
    inquirer.prompt(
        [
            {   name: "name",
                type: "input",
                message: "Name of the product:",
            },
            {   name: "dept",
                type: "input",
                message: "Department of the product:",
            },
            {   name: "price",
                type: "input",
                message: "Price of the product:",
                validate: function(value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {   name: "quantity",
                type: "input",
                message: "Quantity of the product:",
                validate: function(value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ]
    ).then(function(answer) {
        if (parseInt(answer.price < 0.01)) {
            console.log("\nPlease enter a valid price for the product.\n");
            addProduct();
        }
        else if (parseInt(answer.quantity) < 0) {
            console.log("\nPlease enter a valid quantity for the product.\n");
            addProduct();
        }
        else {
            connection.query(
                "INSERT INTO products (item_name, department_name, price, stock_quantity) VALUES ('" + answer.name + "', '" + answer.dept + "', " + answer.price + ", " + answer.quantity + ");", function(err, res) {
                    if (err) throw err;
                    else {
                        console.log("\nProduct added successfully!\n");
                        ask();
                    }
                }
            )
        }
    });
};
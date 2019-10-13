# MySQL-Bamazon
Node.js fake store inventory CLI using MySQL


This is a command-line interface for use in Node.js that simulates a stores inventory management with a MySQL database.

NPM Dependencies: `mysql`, `inquirer`, `console.table`

`bamazonCustomer.js` is the customer-facing interface that allows a customer to select the item and quantity they wish to purchase. The total cost for that item's order is then displayed and logged in the management system.

`bamazonManager.js` is the manager-facing interface that allows a manager to check the quantity and departments of the inventory, add more inventory to an item, and add an entirely new item.

`bamazonSupervisor.js` is the supervisor-facing interface that allows a supervisor to track the total sales and overhead costs per department and to add en entirely new department.

`schema.sql` and `seeds.sql` are the properly coded schema and seeds for working with MySQL.

On setup, the user will have to provide the proper login information to the SQL database in each of the .js files.

Please see the attached screenshots for reference on how these functions work.

This program was written entirely by Tom Elliott.
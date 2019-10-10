USE bamazon;
INSERT INTO products (item_name, department_name, price, stock_quantity)
VALUES ('Toilet plunger', 'Bath', 14.99, 100),
('4K TV', 'Electronics', 849.99, 75),
('Southern Cookbook', 'Books', 9.99, 80),
('Toothpaste', 'Bath', 7.99, 150),
('Superhero Movie Blu-Ray', 'Entertainment', 9.99, 250),
('Video Game Console', 'Electronics', 299.99, 100),
('Cashews', 'Groceries', 9.99, 120),
('Spooky Novel', 'Books', 7.99, 90),
('Toaster Oven', 'Kitchen', 89.99, 50),
('Pack of paper towels', 'Paper Products', 14.99, 75);

SELECT * FROM products;
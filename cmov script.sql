create table users
(
    userid          uuid not null PRIMARY KEY,
    username        varchar(255),
    password        varchar(255),
    fullname        varchar(255),
    creditcard      integer,
    nif             integer,
    coffeecount     integer,
    totalspendings  double precision
);

create unique index table_name_id_uindex
    on users (userid);

create unique index table_name_username_uindex
    on users (username);

INSERT INTO users (userid, username, password, fullname, creditcard, nif, coffeecount, totalspendings)
VALUES ('82338de6-ba66-43d0-81f0-5205529b8c23', 'admin', 'admin' , 'admin', '123', '123', '0', '0');

UPDATE users
SET coffeecount = 5, totalspendings = 4.20
WHERE userid = '82338de6-ba66-43d0-81f0-5205529b8c23';

create table products
(
    productid   serial not null PRIMARY KEY,
    title   	varchar(255),
    details 	varchar(255),
    price 	    double precision,
    image 	    varchar(255)
);

create table vouchers
(
    vouchid     uuid not null PRIMARY KEY,
    userid	    uuid REFERENCES users(userid),
    title   	varchar(255),
    details	    varchar(255),
    image 	    varchar(255),
    type        boolean
);

create table orders
(
    orderid     serial not null PRIMARY KEY,
    userid	    uuid REFERENCES users(userid),
    products   	jsonb,
    vouchers	uuid [],
    date 	    date,
    total       double precision
);

INSERT INTO orders (userid, products, vouchers, date, total)
VALUES ('82338de6-ba66-43d0-81f0-5205529b8c23', '{"1":1,"2":3,"3":2}', '{9bcc7836-3d47-4c05-8a83-cf4f79015deb, cfb78476-dd06-4fe3-8227-e5b6fcc5df25}', '2019-11-12', '2.7');

INSERT INTO vouchers (vouchid, userid, title, details, image, type)
VALUES ('9bcc7836-3d47-4c05-8a83-cf4f79015deb', '82338de6-ba66-43d0-81f0-5205529b8c23', 'Free Coffee' , 'Get a free coffee for every 3 coffees you buy!', 'images/Coffee.webp', true);

INSERT INTO vouchers (vouchid, userid, title, details, image, type)
VALUES ('cfb78476-dd06-4fe3-8227-e5b6fcc5df25', '82338de6-ba66-43d0-81f0-5205529b8c23', 'Free Coffee' , 'Get a free coffee for every 3 coffees you buy!', 'images/Coffee.webp', true);

INSERT INTO vouchers (vouchid, userid, title, details, image, type)
VALUES ('0497155f-2482-4c8b-9d82-ce51e43e1774', '82338de6-ba66-43d0-81f0-5205529b8c23', 'Free Coffee' , 'Get a free coffee for every 3 coffees you buy!', 'images/Coffee.webp', true);

INSERT INTO vouchers (vouchid, userid, title, details, image, type)
VALUES ('c1eb87ee-ee52-45ee-80eb-5bd5a6768416', '82338de6-ba66-43d0-81f0-5205529b8c23', '5% Discount' , 'Every 100€ you spend gets you a 5% discount!', 'images/Coffee.webp', false);

INSERT INTO vouchers (vouchid, userid, title, details, image, type)
VALUES ('1c44e982-9f6d-439c-9673-d88d0703b25c', '82338de6-ba66-43d0-81f0-5205529b8c23', '5% Discount' , 'Every 100€ you spend gets you a 5% discount!', 'images/Coffee.webp', false);

INSERT INTO products (title, details, price, image)
VALUES ('Panini', 'Hot pressed bread.' , '1.00', 'images/Panini.webp');
INSERT INTO products (title, details, price, image)
VALUES ('Ham&Cheese toast', 'Hot pressed sliced bread with ham and cheese.' , '1.00', 'images/HamCheese.webp');
INSERT INTO products (title, details, price, image)
VALUES ('Croissant', 'Simple croissant.' , '1.20', 'images/Croissant.webp');
INSERT INTO products (title, details, price, image)
VALUES ('Coffee', 'Hot cup of coffee.' , '0.50', 'images/Coffee.webp');
INSERT INTO products (title, details, price, image)
VALUES ('Pancakes', 'A stack of 5 pancakes.' , '5.40', 'images/Pancakes.webp');
INSERT INTO products (title, details, price, image)
VALUES ('Coffee with Milk', 'Hot cup of coffee with milk.' , '1.50', 'images/CoffeeWithMilk.webp');
INSERT INTO products (title, details, price, image)
VALUES ('Chocolate Panike', 'Puff pastry with chocolate filling.' , '1.50', 'images/PanikeChocolate.webp');
INSERT INTO products (title, details, price, image)
VALUES ('Ham&Cheese Panike', 'Puff pastry with cheese and ham filling.' , '1.50', 'images/PanikeHamCheese.webp');
INSERT INTO products (title, details, price, image)
VALUES ('Sausage Panike', 'Puff pastry with sausage and ham filling.' , '1.50', 'images/PanikeSausage.webp');


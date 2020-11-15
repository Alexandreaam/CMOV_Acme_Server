create table users
(
    userid          serial not null PRIMARY KEY,
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

INSERT INTO users (username, password, fullname, creditcard, nif, coffeecount, totalspendings)
VALUES ('admin', 'admin' , 'admin', '123', '123', '0', '0');

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
    vouchid     serial not null PRIMARY KEY,
    userid	    int REFERENCES users(userid),
    title   	varchar(255),
    details	    varchar(255),
    image 	    varchar(255)
);

INSERT INTO products (title, details, price, image)
VALUES ('Panini', 'Hot pressed bread.' , '1.00', 'images/Panini.webp');
INSERT INTO products (title, details, price, image)
VALUES ('Ham&Cheese sandwich', 'Hot pressed sliced bread with ham and cheese.' , '1.00', 'images/HamCheese.webp');
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


-- You there! Add initial sql as needed!
-- SC

CREATE USER 'firebox'@'%' IDENTIFIED BY 'n4@WUtd5';

GRANT ALL PRIVILEGES ON * . * TO 'firebox'@'%';

ALTER USER 'root'@'%' IDENTIFIED BY '';

FLUSH PRIVILEGES;

CREATE DATABASE firebox;

--
-- Copyrights to StackInsights
-- All rights are reserved 2019
--

use test;

CREATE TABLE IF NOT EXISTS `user`(
   `id` INT UNSIGNED AUTO_INCREMENT,
   `name` VARCHAR(100) NOT NULL,
   PRIMARY KEY( `id` )
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

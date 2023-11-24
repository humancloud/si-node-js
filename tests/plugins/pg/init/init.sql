--
-- Copyrights to StackInsights
-- All rights are reserved 2019
--

CREATE SEQUENCE user_seq;

CREATE TABLE IF NOT EXISTS "user"(
   id INT CHECK (id > 0) DEFAULT NEXTVAL ('user_seq'),
   name VARCHAR(100) NOT NULL,
   PRIMARY KEY( id )
);

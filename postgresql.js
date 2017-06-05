"use strict"
// ---------------------------------------
// ---------------------------------------
// Introduction:
//
// this file is all you need to create a database, setup that database,
// connect to it and interact with it using PostgresSQL (assuming you've
// already installed PostgreSQL and the server is running, of course)
//
// if you're not sure what this is about, just keep reading and try running
// this script, look at the output and think about what's happening.
//
// if you're already comfortable with all of this, good for you.  rejoice!
// ---------------------------------------
// ---------------------------------------

// first, choose to name your database.  SQLite databases live in one file:
// feel free to be creative.  this will be the name of your file
let DATABASE_NAME = 'first_postgresql_database'

// require the gem pg.  You must type `gem install pg` at the command line
// if not, you'll get this error: `cannot load such file -- pg`
var pg = require('pg')
var pgtools = require('pgtools')

// Faker makes fake data.  Same deal on the gem
var faker = require('faker')


pgtools.createdb({
  user: 'postgres',
  password: '',
  port: 5432,
  host: 'localhost'
}, DATABASE_NAME, function (err, res) {
  if (err) {
    console.error(err)
  }
  // console.log(res)
});
// connection string
var connectionString = 'postgres://localhost:5432/' + DATABASE_NAME


// now that you have a database, set up a connection to it
var db_connection = new pg.Client(connectionString)
db_connection.connect()

// use the methods provided by the Database class in the gem to
// interact with the database


// ---------------------------------------
// cleanup (if we've run this more than once)
// ---------------------------------------

db_connection.query("drop table if exists students;")


// ---------------------------------------
// create the table we'll use later
// ---------------------------------------

// you don't need to use the word SQL below.  it's a "heredoc" (read about it) in Ruby
// that lets you declare multi-line string variables.  we use <<-SQL ... SQL  to specify
// the heredoc so that Sublime notices it and highlights the contents as SQL

db_connection.query(" create table students ( lastname  varchar(255), firstname varchar(255), cohort    varchar(255), phase     int);")


// ---------------------------------------
// INSERT
// ---------------------------------------
console.log("inserting some data ... ")

db_connection.query(" insert into students values ('Lubaway', 'Topher', 'Fence Lizard', 14);")

for (var i=0; i<10; i++) {
  var phase = Math.floor((Math.random() * 4) + 1);

  // prepare the data.  this is definitely WAY more complicated than it needs to be
  var firstName = faker.name.firstName()
  var lastName = faker.name.lastName()
  var company = faker.company.companyName()

  db_connection.query(`insert into students (firstname, lastname, cohort, phase) values ('${firstName}', '${lastName}', '${company}', ${phase})`)

}

console.log( "done." )


// ---------------------------------------
// SELECT
// ---------------------------------------
console.log("selecting some data ... ")




console.log("done.")
console.log("verifying selection ...")

// grab everything in the table
var query = db_connection.query("select * from students;", function (err, result) {
  console.log(result.rows)
})

console.log("and done. ")


// ---------------------------------------
// update
// ---------------------------------------
console.log("updating some data ... ")

// update the table
db_connection.query(" update students set firstname = 'homer', lastname = 'simpson' where phase <= 1; ")

console.log("done.")
console.log("verifying changes ...")

// verify that the data was changed
// grab everything in the table
var query = db_connection.query("select * from students;", function (err, result) {
  console.log(result.rows)
})

console.log("and done.")


// ---------------------------------------
// DELETE
// ---------------------------------------
console.log("deleting some data ... ")

// update the table
db_connection.query(" delete from students where phase <= 1;")

console.log("done.")
console.log("verifying changes ...")

// verify that the data was changed
db_connection.query("select * from students;")

console.log("and done.")

"use strict"
// ---------------------------------------
// ---------------------------------------
// Introduction:
//
// this file is all you need to create a database, setup that database,
// connect to it and interact with it using SQLite3.
//
// if you're not sure what this is about, just keep reading and try running
// this script, look at the output and think about what's happening.
//
// if you're already comfortable with all of this, good for you.  rejoice!
// ---------------------------------------
// ---------------------------------------

// first, choose to name your database.  SQLite databases live in one file:
// feel free to be creative.  this will be the name of your file
let DATABASE_NAME = 'first-sqlite-database'

// require the gem sqlite3.  You must type `gem install sqlite3` at the command line
// if not, you'll get this error: `cannot load such file -- sqlite3`
var sqlite3 = require('sqlite3')

// Faker makes fake data.  Same deal on the gem
var faker = require('faker')


// Set up a connection to the database you have created
// Simply running this command creates a database in your working directory
var db_connection = new sqlite3.Database(DATABASE_NAME + ".db")

// the following warning message comes up when you run this script.
// if you want to avoid it, uncomment this single following line:

// I18n.enforce_available_locales = false # uncomment THIS line to avoid the message below

// ---------------------------------------
// [deprecated] I18n.enforce_available_locales will default to true in the future.
// If you really want to skip validation of your locale you can set
//   I18n.enforce_available_locales = false
// to avoid this message.
// ---------------------------------------

// use the methods provided by the Database class in the gem to
// interact with the database

// ---------------------------------------
// cleanup (if we've run this more than once)
// ---------------------------------------
db_connection.serialize( function () {
  db_connection.run("drop table if exists students;")

  // ---------------------------------------
  // create the table we'll use later
  // ---------------------------------------

  // you don't need to use the word SQL below.  it's a "heredoc" (read about it) in Ruby
  // that lets you declare multi-line string variables.  we use <<-SQL ... SQL  to specify
  // the heredoc so that Sublime notices it and highlights the contents as SQL
  db_connection.run("create table students ( lastname  varchar(255), firstname varchar(255), cohort    varchar(255), phase     int);")

  // ---------------------------------------
  // INSERT
  // ---------------------------------------
  console.log("inserting some data ... ")

  db_connection.run("insert into students values ('Lubaway', 'Topher', 'Fence Lizard', 14);")

  for(var i=0; i<10; i++) {
    var phase = Math.floor((Math.random() * 4) + 1)

    // prepare the data.  this is definitely WAY more complicated than it needs to be
    var firstName = faker.name.firstName()
    var lastName = faker.name.lastName()
    var company = faker.company.companyName()

    var q = `insert into students (firstname, lastname, cohort, phase) values ('${firstName}', '${lastName}', '${company}', ${phase});`

    console.log(q)
    db_connection.run(q)

  }

  console.log("done.")

  // ---------------------------------------
  // SELECT
  // ---------------------------------------
  console.log("selecting some data ... ")


  // grab everything in the table
  db_connection.each("select * from students;", function (err, row) {
    console.log(row.firstName + " " + row.lastName)
  })

  // ---------------------------------------
  // UPDATE
  // ---------------------------------------
  console.log("updating some data ... ")


  // update the table
  db_connection.run("update students set firstname = 'Homer', lastname = 'Simpson' where phase <= 1;")

  console.log("done.")
  console.log("verifying changes ...")

  // verify that the data was changed
  db_connection.each("select * from students;", function (err, row) {
    console.log(row.firstname + " " + row.lastname)
  })
  console.log("and done.")

  // ---------------------------------------
  // DELETE
  // ---------------------------------------
  console.log("deleting some data ... ")

  // update the table
  db_connection.run("delete from students where phase <= 1;")

  console.log("done.")
  console.log("verifying changes ...")

  // verify that the data was changed

  db_connection.each("select * from students;", function (err, row) {
    console.log(row.firstname + " " + row.lastname)
  })

  console.log("and done.")
})

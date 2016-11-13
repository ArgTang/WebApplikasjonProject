# WebApplikasjonProject

+ code for this project can alway be found here: https://github.com/ArgTang/WebApplikasjonProject

This is our projecct for WebApplication subject fall 2016.
The project has two parts over the semester.

We are Using these Technologies:
* .net Core MVC
* .net Core Identity
* .net Core Entity
* Bankid.no dev kit
* Jquery 3
* Jquery 3 datepicker
* Node.js running Gulp.js for helping with compiling and moving scss and ts/js files into wwwrot
* gulp.js
* fixer.io for currency values 

* __Travis__ we have enlisted Travis to do builds on all our pull requests, to help us cooperate easier

## Compile

To get this to compile you need to have .net Core 1.0.1 installed and update visual studio with the latest release.
You can get the tools from here: https://www.microsoft.com/net/core#windows  
You also need Node.js installed. Gulp should run from visual studio, if not run `npm i -g gulp-cli`

## Database

You want to initialise the Db you need to run some commands from the commandline
navigate into the projectfolder `src/Groupproject` and run these commands ` dotnet ef migrations add migrationname` and`dotnet ef database update`
theres also a readme file in the projectfile that explains this in more detail

## Login
Username for demo user is 26118742957
Password is 123456789Ole
this can also be found in Data/Seeddata

# Part two

* Added an admin in seeddata:
        * username: 20058348741
        * password: 20058348741Ole
* Fixed alot of bugs
* cleaned up some code
* Admin can create new users
* Admin can change info on users
* Moved Controller Logic into Buisness Layer
* added tests for adminController
* Added Unittests to our CI server
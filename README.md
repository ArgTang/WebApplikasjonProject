# WebApplikasjonProject

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


## Compile

To get this to compile you need to have .net Core 1.0.1 installed and update visual studio with the latest release.
You can get the tools from here: https://www.microsoft.com/net/core#windows  
You also need Node.js installed. Gulp should run from visual studio, if not run `npm i -g gulp-cli`

## Database

You want to initialise the Db you need to run some commands from the commandline
navigate into the projectfolder `src/Groupproject` and run these commnads ` dotnet ef migrations add migrationname` and`dotnet ef database update`
theres also a readme file in the projectfile that explains this in more detail

## Login
Username for demo user is 26118742957
Password is 123456789Ole
this can also be found in Data/Seeddata

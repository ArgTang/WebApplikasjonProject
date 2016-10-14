# Groupproject

+ we have two db context need to run these commands __twice__ with context flag
+ for cmd `--context ProfileContext` for prfilecontext

## Connecting to the database

To make sure we can connect to the database we need to run some commands in the commandline.

* Tools –> NuGet Package Manager –> Package Manager Console
* Run `Add-Migration initial` to scaffold a migration to create the initial set of tables for your model. If you receive an error stating the term ‘add-migration’ is not recognized as the name of a cmdlet, then close and reopen Visual Studio
* Run `Update-Database` to apply the new migration to the database. Because your database doesn’t exist yet, it will be created for you before the migration is applied.


*   __`Update-Database` needs to be runned each time DB classes changes__ 

more information here : https://docs.efproject.net/en/latest/platforms/aspnetcore/new-db.html

### From cmd


+ commnad is ` dotnet ef migrations add migrationname` and`dotnet ef database update`


using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GroupProject.Models;



namespace GroupProject.Data
{
    public static class SeedData
    {
        public static void SeedPersons(PersonDbContext context)
        {
            context.Database.EnsureDeleted();
            context.Database.EnsureCreated();

            if (!context.Person.Any())
            {
                context.AddRange(new Person
                {
                    
                    PersonNr = "26118742957",
                    passord = "heipaadeg",
                    CreatedDate = DateTime.Now,
                    createdBy = "ole",
                    UpdatedDate = DateTime.Now,
                    UpdatedBy = "ole"
                },
                new Person
                {
                    
                    PersonNr = "2321321312",
                    passord = "heipaadfsdfdeg",
                    CreatedDate = DateTime.Now,
                    createdBy = "bjarne",
                    UpdatedDate = DateTime.Now,
                    UpdatedBy = "bjarne"
                });

                context.SaveChanges();
            }

        }

    }
}

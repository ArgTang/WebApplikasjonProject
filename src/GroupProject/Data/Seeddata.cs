using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GroupProject.Models;

namespace GroupProject.Data
{
    public static class SeedData
    {
        public static void Seed(PersonContext context)
        {
            context.Database.EnsureCreated();
            
            if (!context.Persons.Any())
            {
                context.AddRange( new Person
                {
                    FirstName = "Bob",
                    LastName = "Belcher"
                },
                new Person
                {
                    FirstName = "Sterling Mallory",
                    LastName = "Archer"
                });

                context.SaveChanges();
            }

            if (!context.Addresses.Any())
            {
                context.AddRange(new Address
                {
                    City = "Bergen",
                    Street = "torgallmenningen 2",
                    PersonId = 1,
                    ZipCode = "3442",
                    State = "Hordaland"
                },
                new Address
                {
                    City = "Oslo",
                    Street = "Storgata 234",
                    PersonId = 2,
                    ZipCode = "2322",
                    State = "Oslo"
                });
                context.SaveChanges();
            }
               
        }

    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GroupProject.Models;



namespace GroupProject.Data
{
    public static class SeedData
    {
        public static void Seed(PersonDbContext context)
        {
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
                 
                    PersonNr = "12334578912",
                    passord = "heipaadfsdfdeg",
                    CreatedDate = DateTime.Now,
                    createdBy = "bjarne",
                    UpdatedDate = DateTime.Now,
                    UpdatedBy = "bjarne"
                },
                new Person
                {

                    PersonNr = "34524567897",
                    passord = "asdf",
                    CreatedDate = DateTime.Now,
                    createdBy = "admin",
                    UpdatedDate = DateTime.Now,
                    UpdatedBy = "admin"
                });
                

            }
            context.SaveChanges();
            if (!context.Kontoer.Any())
            {
                context.AddRange(new Konto
                {
                    PersonerId = 1,
                    kontoNr = "1234121234",
                    saldo = 100202,
                    CreatedDate = DateTime.Now,
                    createdBy = "ole",
                    UpdatedDate = DateTime.Now,
                    UpdatedBy = "ole"
                },
                new Konto
                {
                    PersonerId = 3,
                    kontoNr = "6543 00 2342",
                    saldo = 0,
                    CreatedDate = DateTime.Now,
                    createdBy = "geir",
                    UpdatedDate = DateTime.Now,
                    UpdatedBy = "geir"
                },
                new Konto
                {
                    PersonerId = 2,
                    kontoNr = "4321004121",
                    saldo = 231,
                    CreatedDate = DateTime.Now,
                    createdBy = "bjarne",
                    UpdatedDate = DateTime.Now,
                    UpdatedBy = "bjarne"
                });

            }
            context.SaveChanges();
            if (!context.Betal.Any())
            {
                context.AddRange(new Betalinger
                {
                    KontoerId = 1,
                    belop = 12312,
                    info = "betalt til meg",
                    utfort = false,
                    
                    CreatedDate = DateTime.Now,
                    createdBy = "ole",
                    UpdatedDate = DateTime.Now,
                    UpdatedBy = "ole"
                },
                new Betalinger
                {
                    KontoerId = 1,
                    belop = 5675,
                    info = "betalt til meg",
                    utfort = true,
                    datoUtfort = DateTime.Now,
                    CreatedDate = DateTime.Now,
                    createdBy = "ole",
                    UpdatedDate = DateTime.Now,
                    UpdatedBy = "ole"
                },
                new Betalinger
                {
                    KontoerId = 2,
                    belop = 43,
                    info = "betalt til deg",
                    utfort = true,
                    datoUtfort = DateTime.Now,
                    CreatedDate = DateTime.Now,
                    createdBy = "geir",
                    UpdatedDate = DateTime.Now,
                    UpdatedBy = "ole"
                });
            }
            context.SaveChanges();
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GroupProject.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace GroupProject.Data
{
    public class SeedData
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private PersonDbContext _personDbContext;

        public SeedData(PersonDbContext context, UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
            _personDbContext = context;
        }
        public async Task SeedPersons()
        {
            // kun for resetting av database, bør kjøres ved updates
            //_personDbContext.Database.EnsureDeleted();
            //_personDbContext.Database.EnsureCreated();
            if (!await _personDbContext.Users.AnyAsync())
            {
                var newUser = new ApplicationUser
                {
                    UserName = "26118742957",
                    Email = "olelundsor@gmail.com"
                };
                var identityResult = await _userManager.CreateAsync(newUser, "123456789Ole");
            }

            if (!_personDbContext.Person.Any())
            {
                _personDbContext.AddRange(new Person
                {
                   // Id = 1,
                    PersonNr = "26118742957", 
                    forNavn = "ole",
                    etterNavn = "lundsør",
                    CreatedDate = DateTime.Now,
                    createdBy = "ole",
                    UpdatedDate = DateTime.Now,
                    UpdatedBy = "ole",
                   
                },
                new Person
                {
                    PersonNr = "12334578912",
                    forNavn = "per",
                    etterNavn = "hansen",
                    CreatedDate = DateTime.Now,
                    createdBy = "bjarne",
                    UpdatedDate = DateTime.Now,
                    UpdatedBy = "bjarne"
                },
                new Person
                {

                    PersonNr = "34524567897",
                    forNavn = "ola",
                    etterNavn = "nordmann",
                    CreatedDate = DateTime.Now,
                    createdBy = "admin",
                    UpdatedDate = DateTime.Now,
                    UpdatedBy = "admin",
                    
                });
                

            }
            _personDbContext.SaveChanges();
            if (!_personDbContext.Kontoer.Any())
            {
                _personDbContext.AddRange(new Konto
                {
                    PersonerId = 1,
                    kontoNr = "1234121234",
                    saldo = 100202,
                    CreatedDate = DateTime.Now,
                    createdBy = "ole",
                    UpdatedDate = DateTime.Now,
                    UpdatedBy = "ole",
                    kontoType = "Brukerkonto"
                },
                new Konto
                {
                    PersonerId = 1,
                    kontoNr = "6543002342",
                    saldo = 0,
                    CreatedDate = DateTime.Now,
                    createdBy = "geir",
                    UpdatedDate = DateTime.Now,
                    UpdatedBy = "geir",
                    kontoType = "Sparekonto"
                },
                new Konto
                {
                    PersonerId = 1,
                    kontoNr = "4321004121",
                    saldo = 231,
                    CreatedDate = DateTime.Now,
                    createdBy = "bjarne",
                    UpdatedDate = DateTime.Now,
                    UpdatedBy = "bjarne",
                    kontoType = "BSU"
                });

            }
            _personDbContext.SaveChanges();
            if (!_personDbContext.Betal.Any())
            {
                _personDbContext.AddRange(new Betalinger
                {
                    KontoerId = 3,
                    belop = 12312,
                    info = "betalt til meg",
                    utfort = false,
                    tilKonto = "123123123",
                    fraKonto = "12121212",
                    forfallDato = DateTime.Today,
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
                    utfort = false,
                    tilKonto = "123123123",
                    fraKonto = "12121212",
                    forfallDato = DateTime.Now,
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
                    utfort = false,
                    tilKonto = "123123123",
                    fraKonto = "12121212",
                    forfallDato = DateTime.Today,
                    CreatedDate = DateTime.Now,
                    createdBy = "geir",
                    UpdatedDate = DateTime.Now,
                    UpdatedBy = "ole"
                });
            }
            _personDbContext.SaveChanges();
        }
    }
}

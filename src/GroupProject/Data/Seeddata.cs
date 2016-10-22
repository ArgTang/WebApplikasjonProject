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
                    Email = "olelundsor@gmail.com",
                    firstName = "ole",
                    lastName = "lundsør",
                    lastLogin = DateTime.Now
                };
                var identityResult = await _userManager.CreateAsync(newUser, "123456789Ole");
            }

            if (!_personDbContext.Person.Any())
            {
                _personDbContext.AddRange(new Person
                {
                    PersonNr = "26118742957", 
                    CreatedDate = DateTime.Now,
                    createdBy = "ole",
                    UpdatedDate = DateTime.Now,
                    UpdatedBy = "ole",
                   
                },
                new Person
                {
                    PersonNr = "12334578912",
                    CreatedDate = DateTime.Now,
                    createdBy = "bjarne",
                    UpdatedDate = DateTime.Now,
                    UpdatedBy = "bjarne"
                },
                new Person
                {

                    PersonNr = "34524567897",
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
                    kontoNr = "12341212341",
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
                    kontoNr = "65430023421",
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
                    kontoNr = "43210041211",
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
                    belop = (decimal) 12312.25,
                    info = "betalt til meg",
                    utfort = false,
                    tilKonto = "12341212341",
                    fraKonto = "65430023421",
                    mottaker = "ACOS Forsikring",
                    forfallDato = DateTime.Today,
                    CreatedDate = DateTime.Now,
                    createdBy = "ole",
                    UpdatedDate = DateTime.Now,
                    UpdatedBy = "ole"
                },
                new Betalinger
                {
                    belop = (decimal) 5675.00,
                    info = "betalt til meg",
                    utfort = false,
                    tilKonto = "65430023421",
                    fraKonto = "12341212341",
                    mottaker = "ACOS Parkering",
                    forfallDato = DateTime.Now,
                    CreatedDate = DateTime.Now,
                    createdBy = "ole",
                    UpdatedDate = DateTime.Now,
                    UpdatedBy = "ole"
                },
                new Betalinger
                {
                    belop = (decimal) 1.00,
                    info = "betalt til deg",
                    utfort = false,
                    tilKonto = "65430023421",
                    fraKonto = "12341212341",
                    mottaker = "Bestemor",
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

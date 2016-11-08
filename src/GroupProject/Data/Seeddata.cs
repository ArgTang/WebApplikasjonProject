﻿using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using GroupProject.DAL;
using System.Collections.Generic;

namespace GroupProject.Data
{
    /**
     * SeedData
     * 
     * This class is inputting some demo data into the database.
     * But only if the DB is empty
     * 
     * if you need to change data in this file, or the DB model comment in these lines:
     *      _personDbContext.Database.EnsureDeleted();
     *      _personDbContext.Database.EnsureCreated();
     *      
     * These will do a hard reset on the DB. This operation is compute heavy and will
     * add time to the startup of the Application.            
     */
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

                var person = _personDbContext.Person.First();

                var kontoliste = new List<Konto>();
                kontoliste.Add(new Konto
                {
                    person = person,
                    kontoNr = "12341212341",
                    saldo = 100202,
                    CreatedDate = DateTime.Now,
                    createdBy = "ole",
                    UpdatedDate = DateTime.Now,
                    UpdatedBy = "ole",
                    kontoType = Konto.kontoNavn.Brukskonto
                });

                kontoliste.Add(
                    new Konto
                    {
                        person = person,
                        kontoNr = "65430023421",
                        saldo = 0,
                        CreatedDate = DateTime.Now,
                        createdBy = "geir",
                        UpdatedDate = DateTime.Now,
                        UpdatedBy = "geir",
                        kontoType = Konto.kontoNavn.Sparekonto
                    }
                );

                kontoliste.Add(new Konto
                {
                    person = person,
                    kontoNr = "43210041211",
                    saldo = 231,
                    CreatedDate = DateTime.Now,
                    createdBy = "bjarne",
                    UpdatedDate = DateTime.Now,
                    UpdatedBy = "bjarne",
                    kontoType = Konto.kontoNavn.BSU
                });

                _personDbContext.Person.First().konto = kontoliste;
            }
            _personDbContext.SaveChanges();
            if (!_personDbContext.Betal.Any())
            {

                var kontoer = _personDbContext.Person.First().konto;

                var konto = kontoer.Single(k => k.kontoNr == "65430023421");
                konto.betal.AddRange(new List<Betalinger> {
                    new Betalinger {
                        konto = konto,
                        belop = (decimal) 1312.25,
                        info = "Bilforsikring",
                        utfort = false,
                        tilKonto = "12341212341",
                        mottaker = "ACOS Forsikring",
                        forfallDato = DateTime.Today.AddDays(4),
                        CreatedDate = DateTime.Now,
                        createdBy = "ole",
                        UpdatedDate = DateTime.Now,
                        UpdatedBy = "ole"
                    },
                    new Betalinger {
                        konto = konto,
                        belop = (decimal) 1400.65,
                        info = "Resiseforsikring",
                        utfort = false,
                        tilKonto = "12341212341",
                        mottaker = "ACOS Forsikring",
                        forfallDato = DateTime.Today.AddDays(3),
                        CreatedDate = DateTime.Now,
                        createdBy = "ole",
                        UpdatedDate = DateTime.Now,
                        UpdatedBy = "ole"
                    }}
                );

                konto = kontoer.Single(k => k.kontoNr == "12341212341");
                konto.betal.AddRange(new List<Betalinger> {
                    new Betalinger {
                        konto = konto,
                        belop = (decimal) 5675.00,
                        info = "Bot",
                        utfort = false,
                        tilKonto = "65430023421",
                        mottaker = "ACOS Parkering",
                        forfallDato = DateTime.Now.AddDays(14),
                        CreatedDate = DateTime.Now,
                        createdBy = "ole",
                        UpdatedDate = DateTime.Now,
                        UpdatedBy = "ole"
                    },
                    new Betalinger
                    {
                        konto = konto,
                        belop = (decimal) 100.00,
                        info = "betalt til deg",
                        utfort = false,
                        tilKonto = "65430023421",
                        mottaker = "Bestemor",
                        forfallDato = DateTime.Today.AddMonths(1),
                        CreatedDate = DateTime.Now,
                        createdBy = "geir",
                        UpdatedDate = DateTime.Now,
                        UpdatedBy = "ole"
                    }}
                );
            }
            _personDbContext.SaveChanges();
        }
    }
}
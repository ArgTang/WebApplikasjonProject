﻿using GroupProject.DAL;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace GroupProject.Models
{
    public class PersonDbContext: IdentityDbContext<ApplicationUser>
    {

        public PersonDbContext(DbContextOptions<PersonDbContext> options):base(options) 
        {
        }

        public PersonDbContext()
        {
        }

        public virtual DbSet<Person> Person { set; get; }
        public virtual DbSet<Betalinger> Betal { set; get; }
        public virtual DbSet<Konto> Kontoer { get; set; }
    }
}

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;



namespace GroupProject.Models
{
    public class PersonDbContext:DbContext
    {
        
        public PersonDbContext(DbContextOptions<PersonDbContext> options):base(options)
        {

        }

        public DbSet<Person> Person { set; get; }
        public DbSet<Betalinger> Betal { set; get; }
        public DbSet<Konto> Kontoer { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Person>().ToTable("Person");
            modelBuilder.Entity<Betalinger>().ToTable("Betalinger");
            modelBuilder.Entity<Konto>().ToTable("Konto");

            base.OnModelCreating(modelBuilder);
        }
    }
}

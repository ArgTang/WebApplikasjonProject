using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GroupProject.Models;
using Microsoft.EntityFrameworkCore;

namespace GroupProject.Data
{
    public class PersonContext: DbContext
    {
        public PersonContext(DbContextOptions<PersonContext> options )
        {
            
        }

        public DbSet<Person> Persons { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Person>().ToTable("Person");

            base.OnModelCreating(modelBuilder);

            var personModel = modelBuilder.Entity<Person>();
            personModel.HasKey(p => p.Id);
            personModel.Property(p => p.Name).IsRequired().HasMaxLength(40);
        }
    }
}

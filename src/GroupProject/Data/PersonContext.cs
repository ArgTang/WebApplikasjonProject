using GroupProject.Models;
using Microsoft.EntityFrameworkCore;

namespace GroupProject.Data
{
    public class PersonContext: DbContext
    {
        public PersonContext(DbContextOptions<PersonContext> options ):base(options)
        {
            
        }

        public DbSet<Person> Persons { get; set; }
        public DbSet<Address> Addresses { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Person>().ToTable("Person");
            modelBuilder.Entity<Address>().ToTable("Adress");


            base.OnModelCreating(modelBuilder);

            //var personModel = modelBuilder.Entity<Person>();
            //personModel.HasKey(p => p.Id);
            //personModel.Property(p => p.Name).IsRequired().HasMaxLength(40);
        }
    }
}

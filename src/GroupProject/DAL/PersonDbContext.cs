using GroupProject.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace GroupProject.DAL
{
    public class PersonDbContext: IdentityDbContext<ApplicationUser>
    {

        public PersonDbContext(DbContextOptions<PersonDbContext> options):base(options) 
        {
        }

        public DbSet<Person> Person { set; get; }
        public DbSet<Betalinger> Betal { set; get; }
        public DbSet<Konto> Kontoer { get; set; }
    }
}

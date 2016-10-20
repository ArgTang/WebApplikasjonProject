using GroupProject.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GroupProject.DAL
{
    public class DbAccess
    {
        private PersonDbContext _persondbcontext { get; set; }
        public DbAccess(PersonDbContext personDbContext)
        {
            _persondbcontext = personDbContext;
        }
        public List<Konto> getAccounts (ApplicationUser applicationUser)
        {
            String personNr = applicationUser.UserName;

            var person = _persondbcontext.Person
                .Include(s => s.konto)
                .Single(p => p.PersonNr == personNr);
            var retur = person.konto?.ToList() ?? new List<Konto>();

            return retur;
        }

        
    }
}

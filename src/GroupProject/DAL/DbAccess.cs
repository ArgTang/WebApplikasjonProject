using GroupProject.Models;
<<<<<<< HEAD
using Microsoft.EntityFrameworkCore;
=======
>>>>>>> 0f251ae4673f753d701b647a0f3dc909f2031787
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

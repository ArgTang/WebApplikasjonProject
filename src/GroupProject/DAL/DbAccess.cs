using GroupProject.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

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
            var person = getPerson(applicationUser);
            var retur = person.konto?.ToList() ?? new List<Konto>();
            return retur;
        }

        private Person getPerson(ApplicationUser applicationUser)
        {
            String personNr = applicationUser.UserName;

            var person = _persondbcontext.Person
                .Include(s => s.konto)
                .Single(p => p.PersonNr == personNr);

            return person; 
        }

        public List<Betalinger> getBetalinger(ApplicationUser applicationUser)
        {
            var person = getPerson(applicationUser);
            var konto = getAccounts(applicationUser);

            var list = new List<Betalinger>();

            konto.ForEach(a => list.Concat(a?.betal).ToList());

            return list;
           
        }

        public void endreBetaling(Betalinger betal)
        {
            _persondbcontext.Betal.Update(betal);

            _persondbcontext.SaveChanges();
        }
    }
}

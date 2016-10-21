using GroupProject.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;

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
        public void addPayment(Betalinger betalinger)
        {
            _persondbcontext.Betal.AddRange(betalinger);
        }
    }
}

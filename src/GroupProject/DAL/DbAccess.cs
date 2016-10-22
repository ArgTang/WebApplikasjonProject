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

        public List<Betalinger> getPayments(ApplicationUser applicationUser)
        {
            
            List<Betalinger> betalinger = new List<Betalinger>();

            foreach(Konto k in getAccounts(applicationUser))
            {
                foreach(Betalinger b in _persondbcontext.Betal.ToList())
                {
                    if (b.KontoerId == k.Id)
                    {
                        betalinger.Add(b);
                    }
                }
            }
            return betalinger;
           
        }

        public void endreBetaling(Betalinger betal)
        {
            _persondbcontext.Betal.Update(betal);

            _persondbcontext.SaveChanges();
        }
        public void addPayment(Betalinger betalinger)
        {
            _persondbcontext.Betal.AddRange(betalinger);
        }
    }
}

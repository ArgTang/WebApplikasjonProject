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

        public List<Konto> getAccounts(ApplicationUser applicationUser)
        {
            var person = getPerson(applicationUser);
            return person.konto?.ToList() ?? new List<Konto>();
        }

        private Person getPerson(ApplicationUser applicationUser)
        {
            string personNr = applicationUser.UserName;

            return _persondbcontext.Person
                                   .Include(s => s.konto)
                                   .Single(p => p.PersonNr == personNr);
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

        public void changePayment(Betalinger betal)
        {
            _persondbcontext.Betal.Update(betal);
            _persondbcontext.SaveChanges();
        }
    }
}

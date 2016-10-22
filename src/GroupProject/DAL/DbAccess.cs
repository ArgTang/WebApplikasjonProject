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
                //TODO this is **really** bad for performance 
                //we should find a way to get Invoices from person.account not all invoices in the whole DB!!
                foreach(Betalinger b in _persondbcontext.Betal.ToList())
                {
                    if (b.fraKonto == k.kontoNr)
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
        public void addPayment(Betalinger betalinger)
        {
            _persondbcontext.Betal.AddRange(betalinger);
            _persondbcontext.SaveChanges();
        }

        internal Betalinger getInvoice(ApplicationUser user, int id)
        {
            var payments = getPayments(user);
            return payments.Find(invoice => invoice.Id == id);
        }
    }
}

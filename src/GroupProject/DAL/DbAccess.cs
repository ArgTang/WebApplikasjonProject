using System;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace GroupProject.DAL
{
    /**
     * 
     * This is DbAccess *All* queryes to the DB goes in here
     * 
     * PersonDBcontext gets injected from startup.cs 
     */


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

        public Person getPerson(String username)
        {
            string personNr = username;
            return _persondbcontext.Person
                                   .Include(s => s.konto)
                                   .Single(p => p.PersonNr == personNr);
        }

        public List<Betalinger> getPayments(ApplicationUser applicationUser)
        {
            var kontoListe = _persondbcontext.Person
                                   .Include(s => s.konto)
                                   .ThenInclude(k => k.betal)
                                   .Single(p => p.PersonNr == applicationUser.UserName);

            List<Betalinger> betalinger = new List<Betalinger>();
            foreach (Konto k in kontoListe.konto ) {
                betalinger.AddRange(k.betal);
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

        internal bool deleteInvoice(ApplicationUser user, int id)
        {
            Betalinger betaling = getInvoice(user, id);

            if (betaling != null)
            {
                _persondbcontext.Betal.Remove(betaling);
                _persondbcontext.SaveChanges();
                return true;
            }
            return false;

        }
    }
}

using System;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Logging;

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
        private readonly ILogger<DbAccess> _logger;

        public DbAccess(PersonDbContext personDbContext, ILogger<DbAccess> logger)
        {
            try
            {
                _logger = logger;
                _persondbcontext = personDbContext;
            }
            catch (Exception e)
            {
                _logger.LogError("A unhandled error accured accessing personDBContext :::: {Exception}", e);
            }
        }

        public List<Konto> getAccounts(ApplicationUser applicationUser)
        {
            try
            {
                var person = getPerson(applicationUser);
                return person.konto?.ToList() ?? new List<Konto>();
            }
            catch (Exception e)
            {
                _logger.LogError("A unhandled error accured getting accounts with {ApplicationUser} :::: {Exception}",
                    applicationUser, e);
                return null;
            }
        }

        private Person getPerson(ApplicationUser applicationUser)
        {
            try
            {
                string personNr = applicationUser.UserName;
                return _persondbcontext.Person
                    .Include(s => s.konto)
                    .Single(p => p.PersonNr == personNr);
            }
            catch (Exception e)
            {
                _logger.LogError("A unhandled error accured getting person with {ApplicationUser} :::: {Exception}",
                    applicationUser, e);
                return null;
            }
        }

        public Person getPerson(String username)
        {
            try
            {
                return _persondbcontext.Person
                    .Single(p => p.PersonNr == username);
            }
            catch (Exception e)
            {
                _logger.LogError("A unhandled error accured getting person with {Username} :::: {Exception}", username,
                    e);
                return null;
            }
        }

        public List<Betalinger> getPayments(ApplicationUser applicationUser)
        {
            try
            {
                var kontoListe = _persondbcontext.Person
                                                 .Include(s => s.konto)
                                                 .ThenInclude(k => k.betal)
                                                 .Single(p => p.PersonNr == applicationUser.UserName);

                List<Betalinger> betalinger = new List<Betalinger>();
                foreach (Konto k in kontoListe.konto)
                {
                    betalinger.AddRange(k.betal);
                }

                return betalinger;
            }
            catch (Exception e)
            {
                _logger.LogError(
                    "A unhandled error accured getting list of payments with {ApplicationUser} :::: {Exception}",
                    applicationUser, e);
                return null;
            }
        }

        public void changePayment(Betalinger betal)
        {

            try
            {
                _persondbcontext.Betal.Update(betal);
                _persondbcontext.SaveChanges();
                _logger.LogInformation("Payment changed  {Payment}", betal);
            }
            catch (Exception e)
            {
                _logger.LogError("A unhandled error accured changing {Betalinger} :::: {Exception}", betal, e);
            }
        }

        public void addPayment(Betalinger betalinger)
        {
            try
            {
                _persondbcontext.Betal.AddRange(betalinger);
                _persondbcontext.SaveChanges();
                _logger.LogInformation("Payment added  {Payment}", betalinger);
            }
            catch (Exception e)
            {
                _logger.LogError("A unhandled error accured adding {Betalinger} :::: {Exception}", betalinger, e);
            }
        }

        internal Betalinger getInvoice(ApplicationUser user, int id)
        {
            try
            {
                var payments = getPayments(user);
                return payments.Find(invoice => invoice.Id == id);
            }
            catch (Exception e)
            {
                _logger.LogError(
                    "A unhandled error accured getting invoice with {ApplicationUser} and {InvoiceID} :::: {Exception}",
                    user, id, e);
                return null;
            }
        }

        internal bool deleteInvoice(ApplicationUser user, int id)
        {
            try
            {
                Betalinger betaling = getInvoice(user, id);

                if (betaling != null)
                {
                    _persondbcontext.Betal.Remove(betaling);
                    _persondbcontext.SaveChanges();
                    _logger.LogInformation("Payment deleted {Payment}", betaling);
                    return true;
                }
                return false;

            }
            catch (Exception e)
            {
                _logger.LogError(
                    "A unhandled error accured deleting invoice with {ApplicationUser} and {InvoiceID} :::: {Exception}",
                    user, id, e);
                return false;
            }
        }

        public Betalinger getInvoice(int id)
        {
            try
            {
                return _persondbcontext.Betal
                                       .Include(k => k.konto)
                                       .Single(b => b.Id == id);
            }
            catch (Exception e)
            {
                _logger.LogError(
                    "A unhandled error accured retriving invoices :::: {Exception}",
                    e);
                return null;
            }
        }

        public Konto getAccount(String kontoNr)
        {
            try
            {
                return _persondbcontext.Kontoer
                    .Single(k => k.kontoNr == kontoNr);
            }
            catch (Exception e)
            {
                _logger.LogError(
                    "A unhandled error accured retriving invoices :::: {Exception}",
                    e);
                return null;
            }
        }

        public void changeAccount(Konto konto)
        {
            try
            {
                _persondbcontext.Kontoer.Update(konto);
                _persondbcontext.SaveChanges();
                _logger.LogInformation("Account changed {Account}", konto);
            }
            catch (Exception e)
            {
                _logger.LogError(
                  "A unhandled error accured changing {Account} :::: {Exception}",
                  konto, e);
            }
            

        }

        public Betalinger getBetalinger(int id)
        {
            try
            {
                return _persondbcontext.Betal.Single(b => b.Id == id);
            }
            catch (Exception e)
            {
                _logger.LogError(
                    "A unhandled error accured getting payment with {Id} :::: {Exception}",
                    id, e);
                return null;
            }
        }

        public bool executeTransaction(Betalinger betaling)
        {
            try
            {
                Konto toAccount = getAccount(betaling.tilKonto);

                if (toAccount != null)
                {
                    if (betaling.belop <= 0) return false;
                    if (betaling.konto.saldo < betaling.belop) return false;

                    betaling.konto.saldo -= betaling.belop;
                    toAccount.saldo += betaling.belop;
                    betaling.utfort = true;

                    changeAccount(toAccount);
                    changeAccount(betaling.konto);
                    changePayment(betaling);

                    _logger.LogInformation("Transaction made to account inside of bank {Invoice}", betaling);

                    return true;
                }
                
                if (betaling.belop <= 0) return false;
                if (betaling.konto.saldo < betaling.belop) return false;

                betaling.konto.saldo -= betaling.belop;
                betaling.utfort = true;

                changeAccount(betaling.konto);
                changePayment(betaling);

                _logger.LogInformation("Transaction made to account outside of bank {Invoice}", betaling);

                return true;
            }
            catch (Exception e)
            {
                _logger.LogError(
                    "A unhandled error accured executing {Invoice} :::: {Exception}",
                    betaling, e);
                return false;
            }
        }


        public void executeMultipleTransaction(IEnumerable<int> ids)
        {
            try
            {
                foreach (int id in ids)
                {
                    Betalinger betaling = getBetalinger(id);
                    if (betaling != null)
                    {
                        executeTransaction(betaling);
                    }
                }
            }
            catch (Exception e)
            {
                _logger.LogError(
                   "A unhandled error accured executing {Invoices} :::: {Exception}",
                   ids, e);
            }
        }
    }
}

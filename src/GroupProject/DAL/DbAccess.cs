
using System;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;
using GroupProject.Class;

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
        private readonly PersonDbContext _persondbcontext;
        private readonly ILogger<DbAccess> _logger;
        private readonly UserManager<ApplicationUser> _userManager;

        public DbAccess(
            PersonDbContext personDbContext, 
            ILogger<DbAccess> logger,
            UserManager<ApplicationUser> userManager 
        )
        {
            try
            {
                _logger = logger;
                _persondbcontext = personDbContext;
                _userManager = userManager;
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
                return _persondbcontext.Kontoer.Where(x => x.user.Id == applicationUser.Id).ToList();
            }
            catch (Exception e)
            {
                _logger.LogError("A unhandled error accured getting accounts with {ApplicationUser} :::: {Exception}",
                    applicationUser, e);
                return null;
            }
        }
        
        public ApplicationUser getPerson(String username)
        {
            try
            {
                return _persondbcontext.Users.Single(x => x.UserName == username);
            }
            catch (Exception e)
            {
                _logger.LogError("A unhandled error accured getting person with {Username} :::: {Exception}", username, e);
                return null;
            }
        }

        public void changePerson(ApplicationUser user)
        {
            try
            {
                _persondbcontext.Users.Update(user);
                _persondbcontext.SaveChanges();
                _logger.LogInformation("User changed {user}", user);
            }
            catch (Exception e)
            {
                _logger.LogError(
                  "A unhandled error accured changing {user} :::: {Exception}",
                  user, e);
            }
        }

        internal async Task<IdentityResult> createuser(ApplicationUser user, Konto konto, string pass)
        {
            Konto avaialble;
            do {
                Random rnd = new Random();
                int digit = rnd.Next(1, 9999);
                konto.kontoNr = "6543002" + digit.ToString();

                avaialble = _persondbcontext.Kontoer.FirstOrDefault(k => k.kontoNr == konto.kontoNr);
            } while ( avaialble != null );

            konto.user = user;
            user.konto.Add(konto);
            var identityResult = await _userManager.CreateAsync(user, pass);

            if ( identityResult.Succeeded ) {
                _persondbcontext.Kontoer.Add(konto);
                _logger.LogInformation("User {navn} created with account {kontonr} ", user.firstName, konto.kontoNr);
            } else {
                _logger.LogError("Could not create user with {Username} :::: {Exception}", user.firstName, identityResult.Errors);
            }

            return identityResult;
        }

        internal Konto createAccount(Konto konto)
        {
            Konto avaialble;
            do
            {
                Random rnd = new Random();
                int digit = rnd.Next(1, 9999);
                konto.kontoNr = "6543002" + digit.ToString();

                avaialble = _persondbcontext.Kontoer.FirstOrDefault(k => k.kontoNr == konto.kontoNr);
            } while (avaialble != null);

            var identityResult = _persondbcontext.Kontoer.Add(konto);

            if (identityResult != null)
            {
                _persondbcontext.SaveChanges();
               _logger.LogInformation("Konto {konto} created with account {kontonr} ",avaialble, konto.kontoNr);
            }
            else
            {
                _logger.LogError("Could not create konto with {kontoNr} :::: {Exception}");
            }
            return konto;
        }

        public List<Betalinger> getPayments(ApplicationUser applicationUser)
        {
            try
            {
                var kontoListe = _persondbcontext.Users
                                                 .Include(s => s.konto)
                                                 .ThenInclude(k => k.betal)
                                                 .Single(p => p.UserName == applicationUser.UserName);

                

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

        public void updatePayment(Betalinger betal)
        {

            try
            {
                _persondbcontext.Betal.Update(betal);
                _persondbcontext.SaveChanges();
                _logger.LogInformation("Payment updated  {Payment}", betal);
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

        internal void updateLoginDate(ApplicationUser user)
        {
            user.lastLogin = DateTime.Now;
            _persondbcontext.Update(user);
            _persondbcontext.SaveChanges();
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

        public Konto getAccount(string kontoNr)
        {
            try
            {
                return _persondbcontext.Kontoer
                    .Single(k => k.kontoNr == kontoNr);
            }
            catch (Exception e)
            {
                _logger.LogError("A unhandled error accured retriving invoices :::: {Exception}", e);
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

        public Betalinger getBetaling(int id)
        {
            try
            {
                return _persondbcontext.Betal.Include(k => k.konto).Single(b => b.Id == id);
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
                    updatePayment(betaling);

                    _logger.LogInformation("Transaction made to account inside of bank {Invoice}", betaling);

                    return true;
                }

                if ( betaling.belop <= 0 || betaling.konto.saldo < betaling.belop ) {
                    return false;
                }

                betaling.konto.saldo -= betaling.belop;
                betaling.utfort = true;

                changeAccount(betaling.konto);
                updatePayment(betaling);

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


        public PaymentData executeMultipleTransaction(IEnumerable<string> ids)
        {
            PaymentData data = new PaymentData();
            try
            {                
                foreach (string id in ids)
                {
                    Betalinger betaling = getBetaling(Int32.Parse(id));
                    if (betaling != null)
                    {
                        if (!executeTransaction(betaling))
                        {
                            betaling.konto.betal = null;
                            data.falsePayments.Add(betaling);
                            data.error = true;
                        }
                        else
                        {
                            betaling.konto.betal = null;
                            data.sucsessfullPayments.Add(betaling);
                        }
                            
                    }
                }
                return data;
            }
            catch (Exception e)
            {
                _logger.LogError(
                   "A unhandled error accured executing {Invoices} :::: {Exception}",
                   ids, e);

                data.error = true;
            }
            return data;
        }

        public List<Betalinger> getAllPayments()
        {
            try
            {
                return _persondbcontext.Betal.Include(b => b.konto).ToList();
            }
            catch (Exception e)
            {
                _logger.LogError(
                    "A unhandled error accured getting all payment :::: {Exception}", e);
                return null;
            }
        }

        public List<Konto> getAllAccounts()
        {
            try
            {
                return _persondbcontext.Kontoer.ToList();
            }
            catch (Exception e)
            {
                _logger.LogError(
                    "A unhandled error accured getting all payment :::: {Exception}", e);
                return null;
            }
        }
    }
}
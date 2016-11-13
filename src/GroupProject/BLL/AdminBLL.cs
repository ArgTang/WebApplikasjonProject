using GroupProject.DAL;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using GroupProject.ViewModels.Admin;
using System.Threading.Tasks;
using GroupProject.Class;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace GroupProject.BLL
{
    public class AdminBLL
    {
        private readonly DbAccess _access;

        public AdminBLL(
            UserManager<ApplicationUser> userManager, 
            DbAccess dbAccess
        )
        {
            _access = dbAccess;
        }

        public bool executeTransaction(Betalinger betalinger)
        {
            return _access.executeTransaction(betalinger);
        }

        public virtual PaymentData executeTransactions(IEnumerable<string> ids )
        {
            return _access.executeMultipleTransaction(ids);
        }

        public virtual List<Betalinger> getAllUnpaydPayments()
        {
            List<Betalinger> betalinger =  _access.getAllPayments()
                                                  .Where(x => x.utfort == false)
                                                  .ToList();
            betalinger.Sort((x, y) => x.forfallDato.CompareTo(y.forfallDato));
            return betalinger;
        }

        public virtual List<Konto> getAllAccounts()
        {
            return _access.getAllAccounts();
        }

        public virtual async Task<IdentityResult> createuser(RegisterViewModel model)
        {

            Konto konto = new Konto {
                saldo = 0,
                kontoType = Konto.kontoNavn.Brukskonto,
                createdBy = "admin",
                UpdatedBy = "Admin",
                CreatedDate = DateTime.Now,
                UpdatedDate = DateTime.Now
            };
            
            ApplicationUser user = new ApplicationUser {
                firstName = model.firstName,
                lastName = model.lastName,
                PhoneNumber = model.phonenumber,
                postal = model.zipcode,
                adresse = model.adresse,
                Email = model.epost,
                UserName = model.personNr,
                lastLogin = DateTime.Now
            };

            var identityResult = await _access.createuser(user, konto, model.password);
            return identityResult;
        }

        public Konto createKonto(RegisterKontoViewModel model)
        {

            Konto konto = new Konto
            {
                kontoNr = model.kontoNr,
                kontoType = model.kontoType
            };

            var result =  _access.createAccount(konto);
            return konto;
        }

        public virtual ApplicationUser getUser(string username)
        {
            return _access.getPerson(username);
        }

        public virtual void updateUser(EndreBrukerViewModel model, ApplicationUser user)
        {
            user.firstName = model.firstName;
            user.lastName = model.lastName;
            user.PhoneNumber = model.phonenumber;
            user.adresse = model.adresse;
            user.zipcode = model.zipcode;
            user.Email = model.epost;

            _access.changePerson(user);
        }

        public virtual EndreBrukerViewModel populateViewModel(ApplicationUser user)
        {
            EndreBrukerViewModel model = new EndreBrukerViewModel();
            model.personNr = user.UserName;
            model.firstName = user.firstName;
            model.lastName = user.lastName;
            model.phonenumber = user.PhoneNumber;
            model.adresse = user.adresse;
            model.zipcode = user.zipcode;
            model.epost = user.Email;
            return model;
        }
    }
}
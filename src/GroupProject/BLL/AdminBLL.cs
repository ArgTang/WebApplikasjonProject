using GroupProject.DAL;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using GroupProject.ViewModels.Admin;
using System.Threading.Tasks;

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

        public List<Enum> getAccountName()
        {
            return new List<Enum> { };
        }

        public bool executeTransaction(Betalinger betalinger)
        {
            return _access.executeTransaction(betalinger);
        }

        public void executeTransactions(IEnumerable<int> ids)
        {
            _access.executeMultipleTransaction(ids);
        }

        internal List<Betalinger> getALLPayments()
        {
            return _access.getAllPayments();
        }

        internal List<Konto> getAllAccounts()
        {
            return _access.getAllAccounts();
        }

        public async Task<IdentityResult> createuser(RegisterViewModel model)
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

        public ApplicationUser getUser(String username)
        {
            return _access.getPerson(username);
        }

        private void updateUser(RegisterViewModel model, ApplicationUser user)
        {
            user.firstName = model.firstName;
            user.lastName = model.lastName;
            user.PhoneNumber = model.phonenumber;
            user.adresse = model.adresse;
            user.zipcode = model.zipcode;
            user.Email = model.epost;
        }

        public RegisterViewModel populateViewModel(ApplicationUser user)
        {
            RegisterViewModel rvm = new RegisterViewModel();
            rvm.firstName = user.firstName;
            rvm.lastName = user.lastName;
            rvm.phonenumber = user.PhoneNumber;
            rvm.adresse = user.adresse;
            rvm.zipcode = user.zipcode;
            rvm.epost = user.Email;
            return rvm;
        }
    }
}
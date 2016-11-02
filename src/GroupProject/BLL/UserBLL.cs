using GroupProject.DAL;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace GroupProject.BLL
{
    public class UserBLL
    {
        private DbAccess _dbAccess { get; set; }
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;

        public UserBLL(DbAccess dbAccess, 
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager)
        {
            _dbAccess = dbAccess;
            _userManager = userManager;
            _signInManager = signInManager;
        }

        public List<Konto> getAccounts(ApplicationUser user)
        {
            return _dbAccess.getAccounts(user);
        }

        public List<Betalinger> getPayments(ApplicationUser user)
        {
            return _dbAccess.getPayments(user);
            
        }

        public void changePayment(Betalinger betal)
        {
            _dbAccess.changePayment(betal);
        }

        public void addPayment(Betalinger betal)
        {
            _dbAccess.addPayment(betal);
        }
        
        internal Betalinger getInvoice(ApplicationUser user, int id)
        {
            return _dbAccess.getInvoice(user, id);
        }

        internal bool deleteInvoice(ApplicationUser user, int id)
        {
            return _dbAccess.deleteInvoice(user, id);
        }

    }
}

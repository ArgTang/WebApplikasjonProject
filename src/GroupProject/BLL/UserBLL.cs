using GroupProject.DAL;
using GroupProject.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GroupProject.BLL
{
    public class UserBLL
    {
        private PersonDbContext _persondbcontext { get; set; }
        private readonly UserManager<ApplicationUser> _userManager;

        public UserBLL(PersonDbContext personDbContext, UserManager<ApplicationUser> userManager)
        {
            _persondbcontext = personDbContext;
            _userManager = userManager;
        }

        public List<Konto> getAccounts(ApplicationUser user)
        {
            var dbAccess = new DbAccess(_persondbcontext);
            return dbAccess.getAccounts(user);
        }

        public List<Betalinger> getPayments(ApplicationUser user)
        {
            var dbAccess = new DbAccess(_persondbcontext);
            return dbAccess.getPayments(user);
            
        }

        public void changePayment(Betalinger betal)
        {
            var dbAccess = new DbAccess(_persondbcontext);
            dbAccess.changePayment(betal);
        }

        public void addPayment(Betalinger betal)
        {
            var dbAccess = new DbAccess(_persondbcontext);
            dbAccess.addPayment(betal);
        }
        
        internal Betalinger getInvoice(ApplicationUser user, int id)
        {
            var dbAccess = new DbAccess(_persondbcontext);
            return dbAccess.getInvoice(user, id);
        }

        internal bool deleteInvoice(ApplicationUser user, int id)
        {
            var dbAccess = new DbAccess(_persondbcontext);
            return dbAccess.deleteInvoice(user, id);
        }

    }
}

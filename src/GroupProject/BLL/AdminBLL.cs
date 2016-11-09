using GroupProject.DAL;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace GroupProject.BLL
{
    //private DbAccess _dbAccess { get; set; }
    //private readonly UserManager<ApplicationUser> _userManager;
    //private readonly SignInManager<ApplicationUser> _signInManager;

    public class AdminBLL
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly DbAccess _access;

        public AdminBLL(UserManager<ApplicationUser> userManager, DbAccess dbAccess)
        {
            _userManager = userManager;
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

        public void executeTransactions(IEnumerable<int> ids )
        {
            _access.executeMultipleTransaction(ids);
        }
    }
}

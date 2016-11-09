using GroupProject.BLL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GroupProject.DAL;
using Microsoft.AspNetCore.Identity;

namespace Test.BLL
{
    public class AdminBLLStub : AdminBLL
    {
        public AdminBLLStub(UserManager<ApplicationUser> userManager, DbAccess dbAccess) : base(userManager, dbAccess)
        {
        }
    }
}

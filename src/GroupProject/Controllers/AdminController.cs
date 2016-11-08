using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using GroupProject.DAL;
using GroupProject.ViewModels.Admin;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace GroupProject.Controllers
{
    public class AdminController : Controller
    {

        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly DbAccess _access;
        private readonly UserManager<ApplicationUser> _userManager;

        public AdminController(SignInManager<ApplicationUser> signInManager,
        DbAccess dbAccess,
        UserManager<ApplicationUser> userManager
)
        {
            this._signInManager = signInManager;
            _access = dbAccess;
            _userManager = userManager;
        }

        // GET: /<controller>/
        public IActionResult Registrer()
        {
            ViewBag.kontoNavn = Konto.kontoNavn;
            return View();
        }

        public IActionResult EndreBruker()
        {
            return View();
        }

        public IActionResult FakturaOversikt()
        {
            return View();
        }


    }
}

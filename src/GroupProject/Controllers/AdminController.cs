﻿
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using GroupProject.DAL;
using Microsoft.AspNetCore.Authorization;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace GroupProject.Controllers
{
    [Authorize(Roles = "Admin")]
    public class AdminController : Controller
    {

        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly DbAccess _access;       

        public AdminController(
            SignInManager<ApplicationUser> signInManager,            
            UserManager<ApplicationUser> userManager,
            DbAccess dbAccess
        )
        {
            _signInManager = signInManager;            
            _userManager = userManager;
            _access = dbAccess;
        }

        // GET: /<controller>/
        public IActionResult Index()
        { 
            return View(nameof(FakturaOversikt));
        }

        // GET: /<controller>/
        public IActionResult Registrer()
        {
            ViewBag.kontoNavn = Konto.kontoNavn.Brukskonto;
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
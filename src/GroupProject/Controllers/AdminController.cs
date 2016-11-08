﻿using System;
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

        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly DbAccess _access;       

        public AdminController(
            SignInManager<ApplicationUser> signInManager,
            DbAccess dbAccess,
            UserManager<ApplicationUser> userManager
        )
        {
            _signInManager = signInManager;
            _access = dbAccess;
            _userManager = userManager;
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

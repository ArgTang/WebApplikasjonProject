﻿using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using GroupProject.Models;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace GroupProject.Controllers
{
    [Authorize]
    public class LoggedInController : Controller
    {
        private readonly SignInManager<ApplicationUser> _signInManager;

        public LoggedInController(SignInManager<ApplicationUser> signInManager)
        {
            this._signInManager = signInManager;
        }

        // GET: /<controller>/
        public IActionResult Index()
        {
            ViewData["Title"] = "Logged in ACOS";
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return RedirectToAction("Index", "Home");
        }
    }
}
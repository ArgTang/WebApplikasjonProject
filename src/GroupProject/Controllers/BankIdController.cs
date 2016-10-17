using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using GroupProject.ViewModels;
using Microsoft.AspNetCore.Identity;
using GroupProject.Models;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace GroupProject.Controllers
{
    public class BankIdController : Controller
    {

        private readonly UserManager<ApplicationUser> _userManager;
        private PersonDbContext _personDbContext { get; set; }

        public BankIdController(PersonDbContext personDbcontext, UserManager<ApplicationUser> userManager)
        {
            _personDbContext = personDbcontext;
            this._userManager = userManager;
        }


        // GET: /<controller>/
        public IActionResult Identify()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Identify(IdentifyViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = await _userManager.FindByNameAsync(model.Fødselsnummer);

                //If user exist or dont
                if (user.UserName == model.Fødselsnummer)
                {
                    return RedirectToAction("Reference");
                }
                else
                {
                    return RedirectToAction("Error");
                }

            }
            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Reference(IdentifyViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = await _userManager.FindByNameAsync(model.Fødselsnummer);

                //If user exist or dont
                if (user.UserName == model.Fødselsnummer)
                {
                    return RedirectToAction("Password");
                }
                else
                {
                    return RedirectToAction("Error");
                }

            }
            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Password(IdentifyViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = await _userManager.FindByNameAsync(model.Fødselsnummer);

                //If user exist or dont
                if (user.UserName == model.Fødselsnummer)
                {
                    return RedirectToAction("Reference");
                }
                else
                {
                    return RedirectToAction("Error");
                }

            }
            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Error(IdentifyViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = await _userManager.FindByNameAsync(model.Fødselsnummer);

                //If user exist or dont
                if (user.UserName == model.Fødselsnummer)
                {
                    return RedirectToAction("Reference");
                }
                else
                {
                    return RedirectToAction("Error");
                }

            }
            return View(model);
        }


    }
}

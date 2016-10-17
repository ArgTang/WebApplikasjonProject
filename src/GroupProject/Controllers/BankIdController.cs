using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using GroupProject.ViewModels;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace GroupProject.Controllers
{
    public class BankIdController : Controller
    {
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
                var user = await _signInManager.PasswordSignInAsync(
                                            model.Fødselsnummer,
                                            model.password,
                                            model.rememberMe,
                                            lockoutOnFailure: false);

                //Login success or fail
                if (user.Succeeded)
                {
                    return RedirectToAction("Index", "LoggedIn");
                }
                else
                {
                    ModelState.AddModelError(string.Empty, "No user");
                    return View(model);
                }

            }
            return View(model);
        }

        [HttpPost]
        public IActionResult Reference()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Password()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Error()
        {
            return View();
        }


    }
}

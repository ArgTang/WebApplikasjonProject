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

        public BankIdController(PersonDbContext personDbcontext,
            UserManager<ApplicationUser> userManager
        )
        {
            _personDbContext = personDbcontext;

            this._userManager = userManager;

        }
        // GET: /<controller>/
        public IActionResult Identify()
        {
            var model = new IdentifyViewModel();
            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Identify(IdentifyViewModel model)
        {
            if (ModelState.IsValid)
            {
                ApplicationUser user = await _userManager.FindByNameAsync(model.Fødselsnummer);

                //If user exist or dont
                if (user == null )//|| user.UserName == model.Fødselsnummer)
                {
                    return RedirectToAction("Password");
                }
                else
                {
                    return RedirectToAction("Error");
                }

            }else{

            }
            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
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

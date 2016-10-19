using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GroupProject.Annotations;
using Microsoft.AspNetCore.Mvc;
using GroupProject.ViewModels;
using Microsoft.AspNetCore.Identity;
using GroupProject.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Server.Kestrel;
using Microsoft.Extensions.Primitives;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace GroupProject.Controllers
{
    public class BankIdController : Controller
    {
        private readonly String birthKey = "birthnumber";
        private readonly String passKey = "password";
        private readonly SignInManager<ApplicationUser> _signInManager;
        private PersonDbContext _personDbContext { get; set; }

        public BankIdController(PersonDbContext personDbcontext,
            SignInManager<ApplicationUser> signInManager
        )
        {
            _personDbContext = personDbcontext;

            this._signInManager = signInManager;

        }

        // GET: /bankid
        public IActionResult Index()
        {
            return View("Identify");
        }

        // POST: /bankid/identify
        [HttpPost]
        [Route("bankid/identify")]
        public IActionResult PostIdentify()
        {
                try
                {
                    IFormCollection form = Request.Form;
                    
                    if (form.ContainsKey(birthKey))
                    {
                        BirthNumber birthNumber = new BirthNumber();
                        String birthNr = form[birthKey];

                        if (birthNumber.IsValid(form[birthKey].ToString()) && _personDbContext.Users.Any(p => p.NormalizedUserName == form[birthKey]))
                        {
                            HttpContext.Session.SetString(birthKey,birthNr);
                            return View("Reference");
                        }
                    }
                }
                //If no body is specified
                catch (Exception)
                {
                    return View("Error");
                }
            return View("Error");
        }

        // POST: /bankid/password
        [HttpPost]
        [Route("bankid/reference")]
        public IActionResult Reference()
        {
 
            return View();
        }

        // POST: /bankid/password
        [HttpPost]
        [Route("bankid/password")]
        public IActionResult Password()
        {
            ViewBag.error = "hide-error";
            return View();
        }

        // POST: /bankid/password
        [HttpPost]
        [Route("bankid/login")]
        public async Task<IActionResult> Login()
        {
            try
            {
                IFormCollection form = Request.Form;

                if (form.ContainsKey(passKey))
                {
                    String birthNr = HttpContext.Session.GetString(birthKey);

                    var loginresults = await _signInManager.PasswordSignInAsync(birthNr, form[passKey], true, false);
                    if (loginresults.Succeeded)
                    {
                        HttpContext.Session.Remove(birthKey);
                        return Content("loggedIn");
                    }
                    else
                    {
                        ViewBag.error = "show-error";
                        return View("Password");
                    }
                }
                else
                {
                    HttpContext.Session.Remove(birthKey);
                    return View("Error");
                }
            }
            //If no body is specified
            catch (Exception)
            {
                HttpContext.Session.Remove(birthKey);
                return View("Error");
            }
        }
    }
}

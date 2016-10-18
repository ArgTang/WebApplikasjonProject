using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GroupProject.Anotations;
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
        String birthKey = "birthnumber";
        String passKey = "password";
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private PersonDbContext _personDbContext { get; set; }

        public BankIdController(PersonDbContext personDbcontext,
            UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager
        )
        {
            _personDbContext = personDbcontext;

            this._signInManager = signInManager;
            this._userManager = userManager;

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
                        }else{
                            return View("Error");
                        }
                    }
                    else
                    {
                        return View("Error");
                    }
                }
                //If no body is specified
                catch (Exception)
                {
                    return View("Error");
                }
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
            HttpContext.Session.SetString("currentUser","Aleksander 123");
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

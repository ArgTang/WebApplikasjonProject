using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GroupProject.Annotations;
using Microsoft.AspNetCore.Mvc;
using GroupProject.ViewModels;
using Microsoft.AspNetCore.Identity;
using GroupProject.Models;
using Microsoft.AspNetCore.Antiforgery.Internal;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Server.Kestrel;
using Microsoft.Extensions.Primitives;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace GroupProject.Controllers
{
    public class BankIdController : Controller
    {
        private readonly String birthKey = "birthNumber";
        private readonly String passKey = "password";
        private readonly String tokenKey = "authToken";
        private readonly String authKey = "auth";

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
            HttpContext.Session.Clear();
            return View("Identify");
        }

        // POST: /bankid/identify
        [HttpPost]
        [Route("bankid/identify")]
        //[ValidateAntiForgeryToken]
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

                            ViewBag.birthNumber = birthNr;
                            byte[] time = BitConverter.GetBytes(DateTime.UtcNow.ToBinary());
                            byte[] key = Guid.NewGuid().ToByteArray();
                            string token = Convert.ToBase64String(time.Concat(key).ToArray());
                            HttpContext.Session.SetString(tokenKey, token);
                            HttpContext.Session.SetInt32(authKey, 0);

                            ViewBag.authToken = token;

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
        //[ValidateAntiForgeryToken]
        public IActionResult Reference()
        {
            return View();
        }

        // POST: /bankid/password
        [HttpPost]
        [Route("bankid/password")]
        //[ValidateAntiForgeryToken]
        public IActionResult Password()
        {
            ViewBag.error = "hide-error";
            return View();
        }

        // POST: /bankid/password
        [HttpPost]
        [Route("bankid/login")]
        //[ValidateAntiForgeryToken]
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
                        HttpContext.Session.Clear();
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
                HttpContext.Session.Clear();
                return View("Error");
            }
        }

        [HttpPost]
        [Route("bankid/auth")]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> Auth()
        {
            try
            {
                IFormCollection form = Request.Form;

                if (form.ContainsKey(birthKey) && form.ContainsKey(tokenKey))
                {
                    String token = HttpContext.Session.GetString(tokenKey);

                    if (token.Equals(form[tokenKey]))
                    {
                        //is token expired ?
                        byte[] data = Convert.FromBase64String(token);
                        DateTime time = DateTime.FromBinary(BitConverter.ToInt64(data, 0));
                        if (time > DateTime.UtcNow.AddMinutes(-1))
                        {
                            HttpContext.Session.SetInt32(authKey, 1);
                            return Content("authorized");
                        }
                    }
                }
            }
            //If no body is specified
            catch (Exception)
            {
                return View("MobileAuth");
            }
            return Content("error");
        }
        
        [HttpPost]
        [Route("bankid/auth/check")]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> CheckAuth()
        {
            try
            {
                IFormCollection form = Request.Form;

                if (form.ContainsKey(birthKey))
                {
                    String token = HttpContext.Session.GetString(tokenKey);
                    //is token expired ?
                    byte[] data = Convert.FromBase64String(token);
                    DateTime time = DateTime.FromBinary(BitConverter.ToInt64(data, 0));
                    if (time < DateTime.UtcNow.AddMinutes(-1))
                    {
                        HttpContext.Session.Clear();
                        return Content("error");
                    }

                    if (HttpContext.Session.GetInt32(authKey) == 1)
                    {
                        return Content("authorized");
                    }
                    
                }
            }
            //If no body is specified
            catch (Exception)
            {
                return View("MobileAuth");
            }
            return Content("");
        }
        

    }
}

using System;
using System.Linq;
using System.Threading.Tasks;
using GroupProject.Annotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Http;
using GroupProject.DAL;

/**
 * This Controller Do all the magic for logging into the application
 * 
 * We use Identity _signinManager to do validate user and his personal password.
 * 
 */

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

        private readonly String[] referanser = {
            "SMAL SKOLE",
            "IMMUN BANK",
            "DYKTIG KASSE",
            "RIK STUDENT",
            "SIKKER BANK",
            "RIK BANK",
            "ENORM BANK",
            "SVIDD MIDDAG",
            "MYK HJELM",
            "UTRO HAMSTER",
            "SUR LAKS"
        };

        public BankIdController(
            PersonDbContext personDbcontext,
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
        // AJAX
        [HttpPost]
        [Route("bankid/identify")]
        [ValidateAntiForgeryToken]
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
                        HttpContext.Session.SetString(birthKey, birthNr);

                        if (birthNumber.IsValid(form[birthKey].ToString()) && _personDbContext.Users.Any(p => p.NormalizedUserName == form[birthKey]))
                        {
                            HttpContext.Session.SetString(birthKey, birthNr);
                            ViewBag.birthNumber = birthNr;

                            byte[] time = BitConverter.GetBytes(DateTime.UtcNow.ToBinary());
                            byte[] key = Guid.NewGuid().ToByteArray();
                            string token = Convert.ToBase64String(time.Concat(key).ToArray());
                            token = token.Replace('+', '/');
                            HttpContext.Session.SetString(tokenKey, token);
                            HttpContext.Session.SetInt32(authKey, 0);

                            Random r = new Random();
                            int rInt = r.Next(0, referanser.Length);

                            ViewBag.reference = referanser[rInt];
                            ViewBag.authToken = token;

                            return View("Reference");
                        }
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
        // AJAX
        [HttpPost]
        [Route("bankid/reference")]
        [ValidateAntiForgeryToken]
        public IActionResult Reference()
        {
            return View();
        }

        // POST: /bankid/password
        // AJAX
        [HttpPost]
        [Route("bankid/password")]
        [ValidateAntiForgeryToken]
        public IActionResult Password()
        {
            ViewBag.error = "hide";
            return View();
        }

        // POST: /bankid/password
        // AJAX
        [HttpPost]
        [Route("bankid/login")]
        [ValidateAntiForgeryToken]
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

        // POST: /bankid/auth
        // AJAX
        [HttpPost]
        [Route("bankid/auth")]
        [ValidateAntiForgeryToken]
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
                else
                {
                    return View("MobileAuth");
                }
            }
            //If no body is specified
            catch (Exception)
            {
                return View("Error");
            }
            return Content("error");
        }

        // POST: /bankid/auth/check
        // AJAX
        [HttpPost]
        [Route("bankid/auth/check")]
        [ValidateAntiForgeryToken]
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

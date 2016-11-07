﻿using System;
using System.Linq;
using System.Threading.Tasks;
using GroupProject.Annotations;
using GroupProject.BLL;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Http;
using GroupProject.DAL;
using SignInResult = Microsoft.AspNetCore.Identity.SignInResult;

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
        private readonly BankIdBLL _bankIdBll;

        public BankIdController(
            PersonDbContext personDbcontext,
            SignInManager<ApplicationUser> signInManager
        )
        {
            _bankIdBll = new BankIdBLL(HttpContext, signInManager, personDbcontext);
            
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
        [ValidateAntiForgeryToken]
        public IActionResult PostIdentify()
        {
            try
            {
                IFormCollection form = Request.Form;

                if (form.ContainsKey(BankIdBLL.BIRTH_KEY))
                {
                    BirthNumber birthNumber = new BirthNumber();
                    String birthNr = form[BankIdBLL.BIRTH_KEY];

                        if (birthNumber.IsValid(form[BankIdBLL.BIRTH_KEY].ToString()) && _bankIdBll.userExists(form[BankIdBLL.BIRTH_KEY]))
                        {
                            HttpContext.Session.SetString(BankIdBLL.BIRTH_KEY, birthNr);
                            ViewBag.birthNumber = birthNr;

                            ViewBag.reference = _bankIdBll.getRefWord();
                            ViewBag.authToken = _bankIdBll.genToken();

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
        [ValidateAntiForgeryToken]
        public IActionResult Reference()
        {
            return View();
        }

        // POST: /bankid/password
        [HttpPost]
        [Route("bankid/password")]
        [ValidateAntiForgeryToken]
        public IActionResult Password()
        {
            ViewBag.error = "hide-error";
            return View();
        }

        // POST: /bankid/password
        [HttpPost]
        [Route("bankid/login")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login()
        {
            try
            {
                IFormCollection form = Request.Form;

                if (form.ContainsKey(BankIdBLL.PASS_KEY))
                {

                    if (_bankIdBll.login().IsCompleted)
                    {
                        _bankIdBll.clearSession();
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
                    //HttpContext.Session.Remove(BankIdBLL.BIRTH_KEY);
                    _bankIdBll.clearSession();
                    return View("Error");
                }
            }
            //If no body is specified
            catch (Exception)
            {
                _bankIdBll.clearSession();
                return View("Error");
            }
        }

        [HttpPost]
        [Route("bankid/auth")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Auth()
        {
            try
            {
                IFormCollection form = Request.Form;

                if (form.ContainsKey(BankIdBLL.BIRTH_KEY) && form.ContainsKey(BankIdBLL.TOKEN_KEY))
                {
                    if (_bankIdBll.setAuthOk())
                    {
                        return Content("authorized");
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
        
        [HttpPost]
        [Route("bankid/auth/check")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> CheckAuth()
        {
            try
            {
                IFormCollection form = Request.Form;

                if (form.ContainsKey(BankIdBLL.BIRTH_KEY))
                {
                    if (_bankIdBll.isTokenValid())
                    {
                        _bankIdBll.clearSession();
                        return Content("error");
                    }

                    if (_bankIdBll.isAuthOk())
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

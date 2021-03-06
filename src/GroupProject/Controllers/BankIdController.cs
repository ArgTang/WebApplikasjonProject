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
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

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
        private readonly ILogger<BankIdController> _logger;

        public BankIdController(
            DbAccess dbAccess,
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            ILogger<BankIdController> logger
        )
        {
            _bankIdBll = new BankIdBLL(signInManager, userManager, dbAccess);
            _logger = logger;
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

                if (form.ContainsKey(BankIdBLL.BIRTH_KEY))
                {
                    BirthNumber birthNumber = new BirthNumber();
                    String birthNr = form[BankIdBLL.BIRTH_KEY];

                    if (birthNumber.IsValid(form[BankIdBLL.BIRTH_KEY].ToString()) && _bankIdBll.userExists(form[BankIdBLL.BIRTH_KEY]))
                    {
                        HttpContext.Session.SetString(BankIdBLL.BIRTH_KEY, birthNr);
                        ViewBag.birthNumber = birthNr;

                        ViewBag.reference = _bankIdBll.getRefWord();
                        ViewBag.authToken = _bankIdBll.genToken(HttpContext);

                        return View("Reference");
                    }
                }
            }
            //If no body is specified
            catch (Exception)
            {
                _logger.LogError("No form specified on '~/bankid/identify'");
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

                if (form.ContainsKey(BankIdBLL.PASS_KEY))
                {
                    var loggedIn = await _bankIdBll.loginA(HttpContext);

                    if(!loggedIn) {
                        ViewBag.error = "show-error";
                        return View("Password");
                    }

                    var foo = await _bankIdBll.checkAdmin(HttpContext);
                    _bankIdBll.clearSession(HttpContext);
                    
                    return Ok(foo ? "loggedInAdmin" : "loggedIn");
                }
                else
                {
                    _bankIdBll.clearSession(HttpContext);
                    return View("Error");
                }
            }
            //If no body is specified
            catch (Exception)
            {
                _logger.LogError("No form specified on '~/bankid/login'");
                _bankIdBll.clearSession(HttpContext);
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

                if (form.ContainsKey(BankIdBLL.BIRTH_KEY) && form.ContainsKey(BankIdBLL.TOKEN_KEY))
                {
                    if (_bankIdBll.setAuthOk(HttpContext))
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
                _logger.LogError("No form specified on '~/bankid/auth'");
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

                if (form.ContainsKey(BankIdBLL.BIRTH_KEY))
                {
                    if (_bankIdBll.isAuthOk(HttpContext))
                    {
                        return Content("authorized");
                    }
                    
                }
            }
            //If no body is specified
            catch (Exception)
            {
                _logger.LogError("No form specified on '~/bankid/auth/check'");
                return View("MobileAuth");
            }
            return Content("");
        }
    }
}

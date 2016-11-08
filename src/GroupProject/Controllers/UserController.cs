using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using System.Linq;
using GroupProject.DAL;
using GroupProject.ViewModels.User;
using Microsoft.AspNetCore.Http;
using GroupProject.BLL;

/**
 * 
 * This is the User Controller, Only logged in users can visit these links
 * 
 */


namespace GroupProject.Controllers
{
    [Authorize]
    public class UserController : Controller
    {
        private readonly PersonDbContext _persondbcontext;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly UserBLL _userBLL;

        public UserController(SignInManager<ApplicationUser> signInManager, 
            UserManager<ApplicationUser> userManager, 
            UserBLL userBLL
        )
        {
            this._signInManager = signInManager;
            _userManager = userManager;
            _userBLL = userBLL;
        }

        // GET: /<controller>/
        public async Task<ActionResult> Index()
        {
            ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);

            ViewData["Name"] = $"{user.firstName} {user.lastName}";
            ViewData["LastLogin"] = user.lastLogin;

            return View(_userBLL.getAccounts(user));
        }

        public async Task<ActionResult> Faktura()
        {
            ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
            FakturaViewModel model = new FakturaViewModel();
            model.payments = _userBLL.getSortedPayments(user);
            model.accounts = _userBLL.getAccounts(user);

            return View(model);
        }

        [HttpGet]
        public async Task<IActionResult> Betal(int? id)
        {
            ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
            ViewBag.fromAccountList = _userBLL.getAccountNotBSU(user);
            //if no invoice is asked for go to form
            if (id == null || id == 0)
            {
                return View();
            }

            Betalinger invoice = new Betalinger();
            invoice = _userBLL.getInvoice(user, (int)id);

            if ( invoice != null ) {
                             
                return View(_userBLL.changeInvoice(invoice));
            }

            return View("FakturaNotFound");
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [Route("user/faktura/delete")]
        public async Task<IActionResult> deleteInvoice()
        {
            try
            {
                IFormCollection form = Request.Form;

                if (form.ContainsKey("id"))
                {
                    ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
                    int id = int.Parse(form["id"]);

                    if (id > 0)
                    {
                        if (_userBLL.deleteInvoice(user, id))
                        {
                            return Content("success");
                        }
                    }
                }
            }
            //If no body is specified
            catch (Exception)
            {
                return Content("error");
            }
            return Content("error");
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Betal(PaymentViewModel model, int? id)
        {

            ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);

            if (ModelState.IsValid)
            {
                //Get Account
                var account = _userBLL.checkAccount(user, model);
                if ( account == null ) {
                    ModelState.AddModelError("Konto", "Kunne ikke finne konto, vennligst prøv igjenn");
                    return View();
                }

                if (id != null)
                {
                    Betalinger betaling = _userBLL.getInvoice(user, (int)id);
                    if (betaling != null)
                    {
                        _userBLL.changePayment(model,betaling,account,user);
                        
                        return RedirectToAction(nameof(UserController.Faktura));
                    }
                }
                _userBLL.addPayment(model,account,user);
                return RedirectToAction(nameof(UserController.Faktura));
            }

            ViewBag.fromAccountList = _userBLL.getAccountNotBSU(user);

            return View("Betal", model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Logout()
        {
            ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
            user.lastLogin = DateTime.Now;
            await _signInManager.SignOutAsync();

            return RedirectToAction(nameof(HomeController.Index), "Home");
        }
    }
}

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
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly UserBLL _userBLL;

        public UserController(
            SignInManager<ApplicationUser> signInManager, 
            UserManager<ApplicationUser> userManager, 
            UserBLL userBLL
        )
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _userBLL = userBLL;
        }

        // GET: /<controller>/
        public async Task<ActionResult> Index()
        {
            ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);

            ViewData["Name"] = $"{user.firstName} {user.lastName}";
            ViewData["LastLogin"] = user.lastLogin;

            List<Konto> accounts = _userBLL.getAccounts(user);
            return View(accounts);
        }


        public async Task<ActionResult> Faktura()
        {
            ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
            FakturaViewModel model = new FakturaViewModel();
            model.payments = _userBLL.getPayments(user);
            model.payments.Sort((x, y) => x.forfallDato.CompareTo(y.forfallDato));

            model.accounts = _userBLL.getAccounts(user);

            return View(model);
        }

        [HttpGet]
        public async Task<IActionResult> Betal(int? id)
        {
            ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
            ViewBag.fromAccountList = _userBLL.getAccounts(user).Where(item => item.kontoType != Konto.kontoNavn.BSU);

            //if no invoice is asked for go to form
            if (id == null || id == 0)
            {
                return View();
            }

            Betalinger invoice = new Betalinger();
            invoice = _userBLL.getInvoice(user, (int)id);

            //this sucks any other way?
            if ( invoice != null ) {
                PaymentViewModel model = new PaymentViewModel();
                model.amount = ((int) invoice.belop).ToString();
                model.fraction = (invoice.belop - (int) invoice.belop).ToString();
                model.date = invoice.forfallDato;
                model.fromAccount = invoice.konto.kontoNr;
                model.toAccount = invoice.tilKonto;
                model.kid = invoice.kid ?? "";
                model.paymentMessage = invoice.info ?? "";
                model.reciever = invoice.mottaker;

                return View(model);
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
                var account = _userBLL.getAccounts(user).Find(acc => acc.kontoNr == model.fromAccount);
                if ( account == null ) {
                    ModelState.AddModelError("Konto", "Kunne ikke finne konto, vennligst prøv igjenn");
                    return View();
                }

                if (id != null)
                {
                    Betalinger betaling = _userBLL.getInvoice(user, (int)id);
                    if (betaling != null)
                    {
                        betaling.konto = account;
                        betaling.tilKonto = model.toAccount;
                        betaling.belop = new Decimal(Double.Parse(model.amount + "," + model.fraction));
                        betaling.info = model.paymentMessage;
                        betaling.utfort = false;
                        betaling.kid = model.kid;
                        betaling.mottaker = model.reciever;
                        betaling.forfallDato = model.date;
                        betaling.UpdatedDate = DateTime.Now;
                        betaling.UpdatedBy = user.UserName;

                        _userBLL.changePayment(betaling);
                        return RedirectToAction(nameof(UserController.Faktura));
                    }
                    
                }

                _userBLL.addPayment(new Betalinger 
                {
                    konto = account,
                    tilKonto = model.toAccount,                    
                    belop = new Decimal(Double.Parse(model.amount + "," + model.fraction)),
                    info = model.paymentMessage,
                    utfort = false,
                    kid = model.kid,
                    mottaker = model.reciever,
                    forfallDato = model.date,
                    CreatedDate = DateTime.Now,
                    createdBy = user.UserName,
                    UpdatedDate = DateTime.Now,
                    UpdatedBy = user.UserName

                });
                return RedirectToAction(nameof(UserController.Faktura));
            }

            ViewBag.fromAccountList = _userBLL.getAccounts(user).Where(item => item.kontoType != Konto.kontoNavn.BSU);

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

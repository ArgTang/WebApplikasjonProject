using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using GroupProject.Models;
using System.Linq;
using GroupProject.Annotations;
using GroupProject.DAL;
using GroupProject.ViewModels.User;
using Microsoft.AspNetCore.Http;


// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860
namespace GroupProject.Controllers
{
    [Authorize]
    public class UserController : Controller
    {
        private readonly PersonDbContext _persondbcontext;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly DbAccess _access;
        private readonly UserManager<ApplicationUser> _userManager;

        public UserController(SignInManager<ApplicationUser> signInManager, 
            PersonDbContext persondbcontext,
            DbAccess dbAccess,
            UserManager<ApplicationUser> userManager
        )
        {
            this._signInManager = signInManager;
            _persondbcontext = persondbcontext;
            _access = dbAccess;
            _userManager = userManager;
        }

        // GET: /<controller>/
        public async Task<ActionResult> Index()
        {
            ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);

            ViewData["Name"] = $"{user.firstName} {user.lastName}";
            ViewData["LastLogin"] = user.lastLogin;

            List<Konto> accounts = _access.getAccounts(user);
            return View(accounts);
        }


        public async Task<ActionResult> Faktura()
        {
            ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
            FakturaViewModel model = new FakturaViewModel();
            model.payments = _access.getPayments(user);
            model.payments.Sort((x, y) => x.forfallDato.CompareTo(y.forfallDato));

            model.accounts = _access.getAccounts(user);

            return View(model);
        }

        [HttpGet]
        public async Task<IActionResult> Betal(int? id)
        {
            ApplicationUser user = await _userManager.GetUserAsync(HttpContext.User);
            ViewBag.fromAccountList = _access.getAccounts(user).Where(item => item.kontoType != "BSU");

            //if no invoice is asked for go to form
            if (id == null || id == 0)
            {
                return View();
            }

            Betalinger invoice = new Betalinger();
            invoice = _access.getInvoice(user, (int)id);

            //this sucks any other way?
            if ( invoice != null ) {
                PaymentViewModel model = new PaymentViewModel();

                model.amount = ((int) invoice.belop).ToString();
                model.fraction = (invoice.belop - (int) invoice.belop).ToString();
                model.date = invoice.forfallDato;
                model.fromAccount = invoice.fraKonto;
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
                        if (_access.deleteInvoice(user, id))
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
                if (id != null)
                {
                    Betalinger betaling = _access.getInvoice(user, (int)id);
                    if (betaling != null)
                    {
                        betaling.tilKonto = model.toAccount;
                        betaling.fraKonto = model.fromAccount;
                        betaling.belop = new Decimal(Double.Parse(model.amount + "," + model.fraction));
                        betaling.info = model.paymentMessage;
                        betaling.utfort = false;
                        betaling.kid = model.kid;
                        betaling.mottaker = model.reciever;
                        betaling.forfallDato = model.date;
                        betaling.UpdatedDate = DateTime.Now;
                        betaling.UpdatedBy = user.UserName;

                        _access.changePayment(betaling);

                        return RedirectToAction("Faktura");
                    }
                    
                }  
                _access.addPayment(new Betalinger
                {
                    tilKonto = model.toAccount,
                    fraKonto = model.fromAccount,
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
                return RedirectToAction("Faktura");
            }

            ViewBag.fromAccountList = _access.getAccounts(user).Where(item => item.kontoType != "BSU");

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

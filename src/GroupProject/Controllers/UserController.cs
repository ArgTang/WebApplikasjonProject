using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using GroupProject.Models;
using System.Linq;
using GroupProject.DAL;
using GroupProject.ViewModels.User;


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
            var user = await _userManager.GetUserAsync(HttpContext.User);

            ViewData["Name"] = $"{user.firstName} {user.lastName}";
            ViewData["LastLogin"] = user.lastLogin;

            var accounts = _access.getAccounts(user);
            return View(accounts);
        }


        public async Task<ActionResult> Faktura()
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
            FakruraViewModel model = new FakruraViewModel();

        [HttpGet]
        public async Task<IActionResult> Betal(int? id)
        {
            //if no invoice is asked for go to form
            if (id == null) {
                return View();
            }

            var invoice = new Betalinger();

            var user = await _userManager.GetUserAsync(HttpContext.User);
            invoice = _access.getInvoice(user, (int)id);
            
            //this sucks any other way?
            if ( invoice != null ) {
                var model = new PaymentViewModel();

                model.amount = (int) invoice.belop;
                model.fraction = invoice.belop - (int) invoice.belop;
                model.date = invoice.forfallDato;
                model.fromAccount = invoice.fraKonto;
                model.toAccount = invoice.tilKonto;
                model.kid = invoice.kid ?? "";
                model.paymentMessage = invoice.info ?? "";
                model.reciever = invoice.toName;

                return View(model);
            }

            return View();
        }

        public async Task<ActionResult> Betal()
        {
            PaymentViewModel model = new PaymentViewModel();
            ViewData["Title"] = "Logged in ACOS";
            var user = await _userManager.GetUserAsync(HttpContext.User);

            ViewBag.fromAccountList = new List<Konto>();

            foreach (Konto account in _access.getAccounts(user))
            {
                if (!account.kontoType.Equals("BSU"))//Dont add to list if account is BSU
                {
                    ViewBag.fromAccountList.Add(account);
                }
            }

            return View(model);
        }

        public IActionResult deleteInvoice(Betalinger invoice)
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Logout()
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
            user.lastLogin = DateTime.Now;

            await _signInManager.SignOutAsync();
            return RedirectToAction(nameof(HomeController.Index), "Home");
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Betal(PaymentViewModel model)
        {
            
            var user = await _userManager.GetUserAsync(HttpContext.User);
            if (ModelState.IsValid)
            {

                _access.addPayment(new Betalinger{
                    tilKonto = model.toAccount,
                    fraKonto = model.fromAccount,
                    belop = new Decimal(Double.Parse(model.amount+","+model.fraction)),
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

            ViewBag.fromAccountList = new List<Konto>();

            foreach (Konto account in _access.getAccounts(user))
            {
                if (!account.kontoType.Equals("BSU"))//Dont add to list if account is BSU
                {
                    ViewBag.fromAccountList.Add(account);
                }
            }

            return View("Betal", model);
        }
    }
}

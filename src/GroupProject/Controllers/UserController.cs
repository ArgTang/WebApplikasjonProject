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
            ViewData["Title"] = "Logged in ACOS";
            var bruker = await _userManager.GetUserAsync(HttpContext.User); 
            var konto = _access.getAccounts(bruker);
            // sette inn dbacess i klassen
            return View(konto);
        }


        public async Task<ActionResult> Faktura()
        {
            ViewData["Title"] = "Logged in ACOS";
            var bruker = await _userManager.GetUserAsync(HttpContext.User);
            var faktura = _access.getPayments(bruker);
            return View(faktura);
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

        public IActionResult Oversikt()
        {
            ViewData["Title"] = "Logged in ACOS";
            return View();
        }


        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Logout()
        {
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

                return RedirectToAction("Index");
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

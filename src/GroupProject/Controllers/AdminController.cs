using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using GroupProject.DAL;
using GroupProject.BLL;
using System.Threading.Tasks;
using GroupProject.ViewModels.Admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Linq;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace GroupProject.Controllers
{
    //Only allow users that have is an admin
    [Authorize(Roles = "Admin")]
    public class AdminController : Controller
    {
        private readonly AdminBLL _adminBLL;
        private readonly ILogger<AdminController> _logger;

        public AdminController(AdminBLL adminBLL, ILogger<AdminController> logger)
        {
            _adminBLL = adminBLL;
            _logger = logger;
        }

        // GET: /<controller>/
        public IActionResult Index()
        { 
            return RedirectToAction(nameof(AdminController.FakturaOversikt));
        }

        public IActionResult Registrer()
        {
            ViewBag.kontoNavn = Konto.kontoNavn.Brukskonto;
            return View();
        }

        // GET: /<controller>/
        [HttpGet]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> RegistrerNyBruker(RegisterViewModel model)
        {
            if (ModelState.IsValid)
            {
                var res = await _adminBLL.createuser(model);
                if(res.Succeeded) {
                    model = null;
                }
                ViewBag.success = res.Succeeded;
            }
            return View(nameof(AdminController.Registrer), model);
        }

        // GET: /<controller>/
        public IActionResult sokBruker(SearchViewModel model)
        {
            if (ModelState.IsValid)
            {
                ApplicationUser user = _adminBLL.getUser(model.searchUser);
                if (user != null)
                {
                    return View(nameof(AdminController.EndreBruker), _adminBLL.populateViewModel(user));
                }
                else
                {
                    ModelState.AddModelError("searchUser", "Finner ingen bruker med dette fødselsnummeret");
                    return View(model);
                }

            }

            if(model.searchUser == null) {
                ModelState.Clear();
            }
            return View();
        }

        public IActionResult sokBrukerKonto(SearchViewModel model)
        {
            if (ModelState.IsValid)
            {
                ApplicationUser user = _adminBLL.getUser(model.searchUser);
                if (user != null)
                {
                    RegisterKontoViewModel kontoModel = new RegisterKontoViewModel();

                    kontoModel.user = user.UserName;
                    kontoModel.accountTypes = _adminBLL.getAccountTypes();
                    return View(nameof(AdminController.RegistrerNyKonto), kontoModel);
                }
                else
                {
                    ModelState.AddModelError("searchUser", "Finner ingen bruker med dette fødselsnummeret");
                    return View(model);
                }

            }

            if ( model.searchUser == null ) {
                ModelState.Clear();
            }
            return View();
        }

        // GET: /<controller>/
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult RegistrerNyKonto(RegisterKontoViewModel model)
        {
            if (ModelState.IsValid)
            {                
                var res = _adminBLL.createKonto(model);
                if (res != null)
                {
                    return View(nameof(AdminController.sokBrukerKonto));
                }
            }
            return View(model);
        }

        // GET: /<controller>/
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult EndreBruker(EndreBrukerViewModel model)
        {
            if (ModelState.IsValid)
            {
                ApplicationUser user = _adminBLL.getUser(model.personNr);
                if (user != null)
                { 
                    _adminBLL.updateUser(model,user);
                    return RedirectToAction(nameof(AdminController.sokBruker));
                }
            }
            //Denne metoden skal også brukes til å endre brukeren
            return View(model);
        }

        public IActionResult FakturaOversikt()
        {
            FakturaViewModel fvm = new FakturaViewModel();
            fvm.payments = _adminBLL.getAllUnpaydPayments();
            fvm.accounts = _adminBLL.getAllAccounts();
            return View(fvm);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Betal()
        {
            try
            {
                IFormCollection form = Request.Form;

                if (form.ContainsKey("checkBox[]"))
                {
                    return Json(JsonConvert.SerializeObject(_adminBLL.executeTransactions(Request.Form["checkBox[]"])));
                }
            }
            //If no body is specified
            catch (Exception e)
            {
                _logger.LogError("No form specified on '~/admin/faktura/betal'  :::: {Exception}", e);
            }
            return Content("Error");
        }
    }
}
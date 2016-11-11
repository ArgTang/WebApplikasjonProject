using System;
using Microsoft.AspNetCore.Mvc;
using GroupProject.DAL;
using GroupProject.BLL;
using System.Threading.Tasks;
using GroupProject.ViewModels.Admin;
using Microsoft.AspNetCore.Authorization;
using GroupProject.BLL;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace GroupProject.Controllers
{
    [Authorize(Roles = "Admin")]
    public class AdminController : Controller
    {
        private readonly AdminBLL _AdminBLL;
        private readonly ILogger<AdminController> _logger;

        public AdminController(AdminBLL adminBLL, ILogger<AdminController> logger)
        {
            _AdminBLL = adminBLL;
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
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> RegistrerNyBruker(RegisterViewModel model)
        {
            if (ModelState.IsValid)
            {
                var res = await _AdminBLL.createuser(model);
                if(res.Succeeded) {
                    model = null;
                }
                ViewBag.success = res.Succeeded;
            }
            return View(nameof(AdminController.Registrer), model);
        }

        public IActionResult EndreBruker()
        {
            return View();
        }

        public IActionResult FakturaOversikt()
        {
            FakturaViewModel fvm = new FakturaViewModel();
            fvm.payments = _AdminBLL.getAllUnpaydPayments();
            fvm.accounts = _AdminBLL.getAllAccounts();
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
                    return Json(JsonConvert.SerializeObject(_AdminBLL.executeTransactions(Request.Form["checkBox[]"])));
                }
            }
            //If no body is specified
            catch (Exception e)
            {
                _logger.LogError("No form specified on '~/admin/faktura/betal'");
            }
            return Content("Error");
        }
    }
}

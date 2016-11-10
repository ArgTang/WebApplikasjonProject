using System;
using System.Collections;
using System.Collections.Generic;
using GroupProject.Annotations;
using Microsoft.AspNetCore.Mvc;
using GroupProject.DAL;
using GroupProject.ViewModels.Admin;
using Microsoft.AspNetCore.Authorization;
using GroupProject.BLL;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using NuGet.Protocol.Core.v3;

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
            return RedirectToAction("FakturaOversikt");
        }

        // GET: /<controller>/
        public IActionResult Registrer()
        {
            ViewBag.kontoNavn = Konto.kontoNavn.Brukskonto;
            return View();
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

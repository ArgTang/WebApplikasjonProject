using Microsoft.AspNetCore.Mvc;
using GroupProject.DAL;
using GroupProject.ViewModels.Admin;
using Microsoft.AspNetCore.Authorization;
using GroupProject.BLL;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace GroupProject.Controllers
{
    [Authorize(Roles = "Admin")]
    public class AdminController : Controller
    {
        private readonly AdminBLL _AdminBLL;

        public AdminController(AdminBLL adminBLL)
        {
            _AdminBLL = adminBLL;
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
            fvm.payments = _AdminBLL.getALLPayments();
            fvm.accounts = _AdminBLL.getAllAccounts();
            return View(fvm);
        }
    }
}

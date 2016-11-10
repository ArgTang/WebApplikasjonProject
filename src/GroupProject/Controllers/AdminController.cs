using Microsoft.AspNetCore.Mvc;
using GroupProject.DAL;
using GroupProject.BLL;
using System.Threading.Tasks;
using GroupProject.ViewModels.Admin;
using Microsoft.AspNetCore.Authorization;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace GroupProject.Controllers
{
    [Authorize(Roles = "Admin")]
    public class AdminController : Controller
    {
        private readonly AdminBLL _adminBLL;

        public AdminController(AdminBLL adminBLL)
        {
            _adminBLL = adminBLL;
        }

        // GET: /<controller>/
        public IActionResult Index()
        { 
            return RedirectToAction("FakturaOversikt");
        }

        public IActionResult Registrer()
        {
            ViewBag.kontoNavn = Konto.kontoNavn.Brukskonto;
            return View();
        }

        // GET: /<controller>/
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult RegistrerNyBruker(RegisterViewModel model)
        {
            if (ModelState.IsValid)
            {
                _adminBLL.addUser(model);
                ViewBag.success = true;
            }

            return RedirectToAction("Registrer");
        }

        public IActionResult EndreBruker()
        {
            return View();
        }

        public IActionResult FakturaOversikt()
        {
            FakturaViewModel fvm = new FakturaViewModel();
            fvm.payments = _adminBLL.getALLPayments();
            fvm.accounts = _adminBLL.getAllAccounts();
            return View(fvm);
        }
    }
}

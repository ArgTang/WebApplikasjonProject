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
        public async Task<IActionResult> RegistrerNyBruker(RegisterViewModel model,)
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
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult sokBruker(string name)
        {
            _adminBLL.getUser(name);
            return View();
        }

        // GET: /<controller>/
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult EndreBruker()
        {

            return View();
            return View(nameof(AdminController.Registrer), model);
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

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
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult sokBruker(SearchViewModel model)
        {
            _adminBLL.getUser(name);    
            return View("sokBruker");
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult EndreBruker()
        {
            if (ModelState.IsValid)
            {
                ApplicationUser user = _adminBLL.getUser(model.searchUser);
                if (user != null)
                {
                    return View("EndreBruker", _adminBLL.populateViewModel(user));/*RedirectToAction(nameof(AdminController.EndreBruker), _adminBLL.populateViewModel(user));*/
                }

            }
            return View(model);
        }

        // GET: /<controller>/
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult EndreBruker(RegisterViewModel model)
        {
            if (ModelState.IsValid)
            {
                ApplicationUser user = _adminBLL.getUser(model.personNr);
                if (user != null)
                {
                    _adminBLL.updateUser(model,user);
                }
            }
            //Denne metoden skal også brukes til å endre brukeren
            return View(model);
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

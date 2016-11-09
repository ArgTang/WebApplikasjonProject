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
        private readonly AdminBLL _AdminBLL;

<<<<<<< HEAD
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly AdminBLL _adminBLL;       

        public AdminController(
            SignInManager<ApplicationUser> signInManager,
            AdminBLL adminBLL,
            UserManager<ApplicationUser> userManager
        )
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _adminBLL = adminBLL;
=======
        public AdminController(AdminBLL adminBLL)
        {
            _AdminBLL = adminBLL;
        }

        // GET: /<controller>/
        public IActionResult Index()
        { 
            return RedirectToAction("FakturaOversikt");
>>>>>>> master
        }

        public IActionResult Registrer()
        {
<<<<<<< HEAD
=======
            ViewBag.kontoNavn = Konto.kontoNavn.Brukskonto;
>>>>>>> master
            return View();
        }

        // GET: /<controller>/
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> RegistrerNyBruker(RegisterViewModel model)
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
            fvm.payments = _AdminBLL.getALLPayments();
            fvm.accounts = _AdminBLL.getAllAccounts();
            return View(fvm);
        }
    }
}

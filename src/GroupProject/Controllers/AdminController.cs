using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using GroupProject.DAL;
using GroupProject.BLL;
using System.Threading.Tasks;
using GroupProject.ViewModels.Admin;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace GroupProject.Controllers
{
    public class AdminController : Controller
    {

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
        }

        public IActionResult Registrer()
        {
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
            return View();
        }


    }
}

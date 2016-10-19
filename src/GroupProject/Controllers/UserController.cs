using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using GroupProject.Models;
using System.Linq;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860
namespace GroupProject.Controllers
{
    [Authorize]
    public class UserController : Controller
    {
        private PersonDbContext _persondbcontext { get; set; }
        private readonly SignInManager<ApplicationUser> _signInManager;

        public UserController(SignInManager<ApplicationUser> signInManager, PersonDbContext persondbcontext)
        {
            this._signInManager = signInManager;
            _persondbcontext = persondbcontext;
        }


        // GET: /<controller>/
        public IActionResult Index()
        {
            ViewData["Title"] = "Logged in ACOS";
            var konto = _persondbcontext.Kontoer.ToList();
            return View(konto);
        }


        public IActionResult Faktura()
        {
            ViewData["Title"] = "Logged in ACOS";
            return View();
        }

        public IActionResult Betal()
        {
            ViewData["Title"] = "Logged in ACOS";
            return View();
        }

        //[HttpPost]
        //[ValidateAntiForgeryToken]
        //public IActionResult Betal()
        //{
        //    ViewData["Title"] = "Logged in ACOS";
        //    return View();
        //}

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return RedirectToAction(nameof(HomeController.Index), "Home");
        }
    }
}

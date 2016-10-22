using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using GroupProject.Models;
using System.Linq;
using GroupProject.DAL;
using System;


// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860
namespace GroupProject.Controllers
{
    [Authorize]
    public class UserController : Controller
    {
        private readonly PersonDbContext _persondbcontext;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly DbAccess _access;
        private readonly UserManager<ApplicationUser> _userManager;

        public UserController(SignInManager<ApplicationUser> signInManager, 
            PersonDbContext persondbcontext,
            DbAccess dbAccess,
            UserManager<ApplicationUser> userManager
        )
        {
            this._signInManager = signInManager;
            _persondbcontext = persondbcontext;
            _access = dbAccess;
            _userManager = userManager;
        }

        // GET: /<controller>/
        public async Task<ActionResult> Index()
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);

            ViewData["Name"] = $"{user.firstName} {user.lastName}";
            ViewData["LastLogin"] = user.lastLogin;

            var accounts = _access.getAccounts(user);
            return View(accounts);
        }


        public async Task<ActionResult> Faktura()
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
            var faktura = _access.getPayments(user);
            return View(faktura);
        }

        public IActionResult Betal()
        {
            return View();
        }

        public IActionResult Oversikt()
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
            var user = await _userManager.GetUserAsync(HttpContext.User);
            user.lastLogin = DateTime.Now;

            await _signInManager.SignOutAsync();
            return RedirectToAction(nameof(HomeController.Index), "Home");
        }
    }
}

using System.Linq;
using Microsoft.AspNetCore.Mvc;
using GroupProject.Models;
using Microsoft.Extensions.Configuration;
using GroupProject.Data;
using GroupProject.ViewComponents;
using GroupProject.ViewModels;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace GroupProject.Controllers
{
    public class HomeController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;

        private PersonDbContext _personDbContext { get; set; }

        public HomeController(PersonDbContext personDbcontext, 
            UserManager<ApplicationUser> userManager, 
            SignInManager<ApplicationUser> signInManager
        )
        {
            _personDbContext = personDbcontext; 
            SeedData.Seed(_personDbContext);

            this._userManager = userManager;
            this._signInManager = signInManager;


        }
    // GET: /<controller>/
        public IActionResult Index()
        {
            var persons = _personDbContext.Person.ToList();
            ViewData["Title"] = "Sparebank ACOS";
            return View(persons);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Index(LoginViewModel model) {

            if ( ModelState.IsValid ) {
                var loginresults = await _signInManager.PasswordSignInAsync(
                                            model.username, 
                                            model.password, 
                                            model.rememberMe, 
                                            lockoutOnFailure: false);
                //Login success or fail
                if(loginresults.Succeeded) {
                    return RedirectToAction("Index", "LoggedIn");
                } else {
                    ModelState.AddModelError(string.Empty, "Invalid login");
                    return View(model);
                }

            }
            return View(model);
        }

        public IActionResult Register() {

            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Register(RegisterViewModel model) {
            if(ModelState.IsValid) {
                var identityUser = new ApplicationUser {
                    UserName = model.username,
                    Email = model.username
                };

                var identityResult = await _userManager.CreateAsync(identityUser);

                if ( identityResult.Succeeded ) {
                    await _signInManager.SignInAsync(identityUser, isPersistent: false);
                    return RedirectToAction("Index", "LoggedIn");
                } else {
                    ModelState.AddModelError(string.Empty, "Registration failed");
                    return View(model);
                }
            }
            return View(model);
        }

        //public IActionResult ResetPassword() {

        //    return View();
        //}

        //[HttpPost]
        //[ValidateAntiForgeryToken]
        //public  async Task<IActionResult> ResetPassword(ResetPasswordViewModel model) {

        //    return View();
        //}

        //public IActionResult ForgotPassword() {

        //    return View();
        //}

        //[HttpPost]
        //[ValidateAntiForgeryToken]
        //public async Task<IActionResult> ForgotPassword(ForgotPasswordViewModel model) {

        //    return View();
        //}

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Logout() {

            await _signInManager.SignOutAsync();
            return RedirectToAction("index", "Home");
        }
    }
}

using System.Linq;
using Microsoft.AspNetCore.Mvc;
using GroupProject.Models;
using Microsoft.Extensions.Configuration;
using GroupProject.Data;
using GroupProject.ViewComponents;
using GroupProject.ViewModels;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace GroupProject.Controllers
{
    public class HomeController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly ILogger<HomeController> _logger;

        private PersonDbContext _personDbContext { get; set; }

        public HomeController(PersonDbContext personDbcontext,
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            ILogger<HomeController> logger
        )
        {
            _personDbContext = personDbcontext;
            SeedData.Seed(_personDbContext);

            this._userManager = userManager;
            this._signInManager = signInManager;

            _logger = logger;

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
        public async Task<IActionResult> Index(LoginViewModel model)
        {

            if ( ModelState.IsValid ) {
                var loginresults = await _signInManager.PasswordSignInAsync(
                                            model.username,
                                            model.password,
                                            model.rememberMe,
                                            lockoutOnFailure: false);

                //Login success or fail
                if ( loginresults.Succeeded ) {
                    _logger.LogInformation(1, "User logged in.");
                    return RedirectToAction("Index", "LoggedIn");
                } else {
                    _logger.LogWarning(1, "invalid login");
                    ModelState.AddModelError(string.Empty, "Invalid login");
                    return View(model);
                }

            }
            return View(model);
        }

        public IActionResult Register()
        {

            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Register(RegisterViewModel model)
        {
            if ( ModelState.IsValid ) {
                // create new user
                var identityUser = new ApplicationUser {
                    UserName = model.username,
                    Email = model.username
                };

                var identityResult = await _userManager.CreateAsync(identityUser, model.password);

                //login wih new user or send back to registration form
                if ( identityResult.Succeeded ) {
                    var loginresults = await _signInManager.PasswordSignInAsync(
                                            model.username,
                                            model.password,
                                            false,
                                            lockoutOnFailure: false);
                    return RedirectToAction("Index", "LoggedIn");
                } else {
                    ModelState.AddModelError(string.Empty, $"Registration failed: {identityResult.ToString()}");
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
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return RedirectToAction("index", "Home");
        }
    }
}

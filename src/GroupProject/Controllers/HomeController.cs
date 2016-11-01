using Microsoft.AspNetCore.Mvc;
using GroupProject.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using GroupProject.DAL;

/**
 * 
 * This is the homeController wich serves Index site
 * 
 * It has som testcode for simple login and registration of users
 * wich we will expand in the future
 * 
 */

namespace GroupProject.Controllers
{
    [AllowAnonymous]
    public class HomeController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly ILogger<HomeController> _logger;

        private PersonDbContext _personDbContext { get; set; }

        public HomeController(
            //PersonDbContext personDbcontext,
            //UserManager<ApplicationUser> userManager,
            //SignInManager<ApplicationUser> signInManager,
        )
        {
            //_personDbContext = personDbcontext;
            //this._userManager = userManager;
            //this._signInManager = signInManager;
        }

        // GET: /<controller>/
        public IActionResult Index()
        {
            return View();
        }

        //[HttpPost]
        //[ValidateAntiForgeryToken]
        //public async Task<IActionResult> Index(LoginViewModel model)
        //{
        //    if ( ModelState.IsValid ) {
        //        var loginresults = await _signInManager.PasswordSignInAsync(
        //                                    model.username,
        //                                    model.password,
        //                                    model.rememberMe,
        //                                    lockoutOnFailure: false);

        //        //Login success or fail
        //        if ( loginresults.Succeeded ) {
        //            return RedirectToAction(nameof(UserController.Index), "User");
        //        } else {
        //            _logger.LogWarning("invalid login attempt");
        //            ModelState.AddModelError(string.Empty, "Invalid login");
        //            return View(model);
        //        }

        //    }
        //    return View(model);
        //}

        //public IActionResult Register()
        //{

        //    return View();
        //}

        //[HttpPost]
        //[ValidateAntiForgeryToken]
        //public async Task<IActionResult> Register(RegisterViewModel model)
        //{
        //    if ( ModelState.IsValid ) {
        //        // create new user
        //        var newUser = new ApplicationUser {
        //            UserName = model.username,
        //            Email = model.username
        //        };

        //        var identityResult = await _userManager.CreateAsync(newUser, model.password);

        //        //login wih new user or send back to registration form
        //        if ( identityResult.Succeeded ) {                    
        //            var loginresults = await _signInManager.PasswordSignInAsync(
        //                                    model.username,
        //                                    model.password,
        //                                    false, ///remember me flag
        //                                    lockoutOnFailure: false);
        //            _logger.LogInformation($"Created new user: {newUser.ToString()}");
        //            return RedirectToAction(nameof(UserController.Index), "User");
        //        } else {
        //            var message = $"Registration failed: {identityResult.ToString()}";
        //            _logger.LogWarning(message);
        //            ModelState.AddModelError(string.Empty, message);
        //            return View(model);
        //        }
        //    }
        //    return View(model);
        //}

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
    }
}

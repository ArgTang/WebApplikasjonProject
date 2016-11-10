using System;
using Microsoft.AspNetCore.Mvc;
using GroupProject.DAL;
using GroupProject.BLL;
using System.Threading.Tasks;
using GroupProject.ViewModels.Admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace GroupProject.Controllers
{
    [Authorize(Roles = "Admin")]
    public class AdminController : Controller
    {
        private readonly AdminBLL _adminBLL;
        private readonly UserManager<ApplicationUser> _userManager;

        public AdminController(AdminBLL adminBLL, UserManager<ApplicationUser> userManager )
        {
            _adminBLL = adminBLL;
            _userManager = userManager;
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
        public async Task<IActionResult> RegistrerNyBruker(RegisterViewModel model)
        {

            /*Hei Tor! Du lurer kanskje på hva all denne logikken gjør i denne metoden ?
             * jo det skal jeg fortelle deg! Vi har nå sittet her i 7 timer å prøvd å 
             * med lagdeling, men det viser seg at i kontroller er det eneste stedet
             * " _usermanager.CreateAsync " fungerer. Håper på forståelse, hilsen ACO
             */
            if (ModelState.IsValid)
            {
                ApplicationUser user = new ApplicationUser
                {
                    firstName = model.firstName,
                    lastName = model.lastName,
                    PhoneNumber = model.phonenumber,
                    postal = model.zipcode,
                    adresse = model.adresse,
                    Email = model.epost,
                    UserName = model.personNr

                    //TODO må opprette konto
                };

                var identityResult = await _userManager.CreateAsync(user, model.password);
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

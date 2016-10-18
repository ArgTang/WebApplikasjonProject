using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GroupProject.Anotations;
using Microsoft.AspNetCore.Mvc;
using GroupProject.ViewModels;
using Microsoft.AspNetCore.Identity;
using GroupProject.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace GroupProject.Controllers
{
    public class BankIdController : Controller
    {

        private readonly UserManager<ApplicationUser> _userManager;
        private PersonDbContext _personDbContext { get; set; }

        public BankIdController(PersonDbContext personDbcontext,
            UserManager<ApplicationUser> userManager
        )
        {
            _personDbContext = personDbcontext;

            this._userManager = userManager;

        }

        // GET: /<controller>/
        public IActionResult Index()

        {
            var model = new IdentifyViewModel();
            return View("Identify",model);
        }

        [HttpPost]
        [Route("bankid/identify")]
        public async Task<IActionResult> PostIdentify()
        {
                try
                {
                    IFormCollection form = Request.Form;
                    String key = "birthnumber";
                    if (form.ContainsKey(key))
                    {
                        BirthNumber birthNumber = new BirthNumber();

                        if (birthNumber.IsValid(form[key].ToString()) && _personDbContext.Users.Any(p => p.NormalizedUserName == form[key])){
                            return View("Reference");
                        }else{
                            return View("Error");
                        }
                    }
                    else
                    {
                        return View("Error");
                    }
                }
                //If no body is specified
                catch (Exception)
                {
                    return View("Error");
                }
        }
    }
}

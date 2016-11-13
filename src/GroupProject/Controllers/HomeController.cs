using Microsoft.AspNetCore.Mvc;
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
        // GET: /<controller>/
        public IActionResult Index()
        {
            return View();
        }
    }
}

using System.Linq;
using Microsoft.AspNetCore.Mvc;
using GroupProject.Models;
using Microsoft.Extensions.Configuration;
using GroupProject.Data;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace GroupProject.Controllers
{
    public class HomeController : Controller
    {

        private PersonDbContext _personDbContext { get; set; }

        public HomeController(PersonDbContext personDbcontext )
        {
            _personDbContext = personDbcontext; 
            SeedData.Seed(_personDbContext);

        }
        // GET: /<controller>/
        public IActionResult Index()
        {
            var persons = _personDbContext.Person.ToList();

            return View(persons);
        }

        public IActionResult About() {
            ViewData["Title"] = "About";
            ViewBag.Message = "About";
            return View();
        }

        public IActionResult Contact() {
            ViewData["Title"] = "Contact";
            ViewBag.Message = "This is not Index, but Contact";
            return View();
            ViewData["Title"] = "Sparebank ACOS";
            return View(persons);
        }
    }
}

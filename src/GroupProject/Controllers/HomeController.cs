using System.Linq;
using Microsoft.AspNetCore.Mvc;
using GroupProject.Models;
using Microsoft.Extensions.Configuration;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace GroupProject.Controllers
{
    public class HomeController : Controller
    {

        public HomeController()
        {
            //SeedData.Seed(personDbContext);
        }
        // GET: /<controller>/
        public IActionResult Index()
        {
            //var persons = personContext.Personer.ToList();
            //ViewData["Title"] = "Index";
            //ViewBag.Message = "This is Index";
            return View();
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
        }
    }
}

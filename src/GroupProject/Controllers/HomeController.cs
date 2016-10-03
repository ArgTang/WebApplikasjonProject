using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GroupProject.Data;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace GroupProject.Controllers
{
    public class HomeController : Controller
    {
        private PersonContext personContext;

        public HomeController(PersonContext personContext)
        {
            this.personContext = personContext;
            SeedData.Seed(personContext);
        }
        // GET: /<controller>/
        public IActionResult Index()
        {
            var persons = personContext.Persons.ToList();
            ViewData["Title"] = "Index";
            ViewBag.Message = "This is Index";
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
        }
    }
}

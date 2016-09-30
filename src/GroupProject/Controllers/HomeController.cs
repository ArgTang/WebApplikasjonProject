using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace GroupProject.Controllers
{
    public class HomeController : Controller
    {
        // GET: /<controller>/
        public IActionResult Index()
        {
            ViewData["Title"] = "Index";
            ViewBag.Message = "This is Index";
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

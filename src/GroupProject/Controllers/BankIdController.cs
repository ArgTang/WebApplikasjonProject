using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace GroupProject.Controllers
{
    public class BankIdController : Controller
    {
        // GET: /<controller>/
        public IActionResult Identify()
        {
            return View();
        }

        public IActionResult Reference()
        {
            return View();
        }

        public IActionResult Password()
        {
            return View();
        }


    }
}

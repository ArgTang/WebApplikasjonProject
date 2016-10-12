using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace GroupProject.ViewModels
{
    public class Login
    {
        [Key]
        public Guid LoginId { get; set; }

        public string username { get; set; }

        public string password { get; set; }
    }
}

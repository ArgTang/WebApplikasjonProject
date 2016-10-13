using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace GroupProject.ViewModels
{
    public class LoginViewModel
    {
        [Required]
        [DataType(DataType.EmailAddress)]
        [Display(Name = "Brukernavn", Prompt = "Brukernavn")]
        public string username { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Passord", Prompt = "Passord")]
        public string password { get; set; }

        [Display(Name = "Remember me")]
        public bool rememberMe { get; set; }
    }
}

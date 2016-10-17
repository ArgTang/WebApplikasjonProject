using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace GroupProject.ViewModels
{
    public class ResetPasswordViewModel
    {
        [Required]
        [EmailAddress]
        public string email { get; set; }

        [Required]
        [StringLength(60, 
            ErrorMessage = "The password must be between 6 and 60 chars long"),
            MinLength(6)
        ]
        [DataType(DataType.Password)]
        public string password { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Confirn Password")]
        [Compare("password", ErrorMessage = "Both passwords must match")]
        public string confirmPassword { get; set; }
    }
}

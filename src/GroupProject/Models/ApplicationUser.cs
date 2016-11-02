using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using System;
using System.ComponentModel.DataAnnotations;

namespace GroupProject.Models
{
    public class ApplicationUser:IdentityUser
    {
        [Required]
        public string firstName { get; set; }

        [Required]
        public string lastName { get; set; }

        public string phonenumber { get; set; }

        public string adresse { get; set; }

        public string zipcode { get; set; }

        public string postal { get; set; }

        public string epost { get; set; }

    [Required]
        public DateTime lastLogin { get; set; }
    }
}
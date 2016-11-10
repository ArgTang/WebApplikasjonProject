using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace GroupProject.DAL
{
    public class ApplicationUser:IdentityUser
    {
        [Required]
        public string firstName { get; set; }

        [Required]
        public string lastName { get; set; }

        [Required]
        public string adresse { get; set; }

        [Required]
        public string zipcode { get; set; }

        public string postal { get; set; }

        [Required]
        public DateTime lastLogin { get; set; }

        public virtual List<Konto> konto { get; set; } = new List<Konto>();
    }
}
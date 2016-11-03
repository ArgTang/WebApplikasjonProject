using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using System;
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
        public DateTime lastLogin { get; set; }
    }
}
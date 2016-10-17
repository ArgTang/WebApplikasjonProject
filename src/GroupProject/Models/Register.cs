using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace GroupProject.Models
{
    public class Register
    {
        [Key]
        public Guid registerId { get; set; }

        public string username { get; set; }

        public string password { get; set; }
    }
}

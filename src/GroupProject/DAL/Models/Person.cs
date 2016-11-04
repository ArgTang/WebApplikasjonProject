using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace GroupProject.DAL 
{
    [Table("Person")]
    public class Person : BaseModel
    {
               
        [Required(ErrorMessage = "PersonNr må skrives inn")]
        [StringLength(11, MinimumLength = 11)]
        public string PersonNr { get; set; }

        public virtual List<Konto> konto { get; set; } = new List<Konto>();

    }
}

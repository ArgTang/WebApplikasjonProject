﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace GroupProject.Models 
{
    [Table("Person")]
    public class Person : BaseModel
    {
        [Required(ErrorMessage = "Passord må skrives inn")]
        public string passord { get; set; }

        [Required(ErrorMessage = "PersonNr må skrives inn")]
        [StringLength(11, MinimumLength = 11)]
        public string PersonNr { get; set; }

        [Required(ErrorMessage = "Epost må skrives inn")]
        [StringLength(100)]
        public string epost { get; set; }

        public virtual ICollection<Konto> konto { get; set; }

    }
}

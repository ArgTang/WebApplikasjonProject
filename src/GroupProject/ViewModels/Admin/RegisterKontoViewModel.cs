
﻿using System;
 using System.Collections.Generic;
using GroupProject.DAL;
using System.ComponentModel.DataAnnotations;
using GroupProject.Annotations;

namespace GroupProject.ViewModels.Admin
{
    public class RegisterKontoViewModel
    {
       

        [Required(ErrorMessage = "Saldo må skrives inn")]
        public decimal saldo { get; set; }               

        [Required(ErrorMessage = "Kontotype må være valgt")]
        public Konto.kontoNavn type { get; set; }

        public ApplicationUser user { get; set; }

        public IEnumerable<Konto.kontoNavn> accountTypes { get; set; }
    }
}
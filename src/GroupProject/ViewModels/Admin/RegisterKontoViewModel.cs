
﻿using System.Collections.Generic;
using GroupProject.DAL;
using System.ComponentModel.DataAnnotations;
using GroupProject.Annotations;

namespace GroupProject.ViewModels.Admin
{
    public class RegisterKontoViewModel
    {
        [Required(ErrorMessage = "KontoNr må skrives inn")]
        public string kontoNr { get; set; }

        [Required(ErrorMessage = "Saldo må skrives inn")]
        public decimal saldo { get; set; }

        //drop down med kontotyper
        //dette er ikke en liste, burde også være av typen ENUM
        [Required(ErrorMessage = "Dette feltet må være utfylt")]
        public IEnumerable<Konto.kontoNavn> kontoType { get; set; }
    }
}
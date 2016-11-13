
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
                
        public enum kontoNavn
        {
            BSU,
            Sparekonto,
            Brukskonto
        }

        //drop down med kontotyper
        //dette er ikke en liste, burde også være av typen ENUM
        [Required(ErrorMessage = "Kontotype må være valgt")]
        public Konto.kontoNavn type { get; set; }

        public IEnumerable<Konto.kontoNavn> accountTypes { get; set; }
    }
}
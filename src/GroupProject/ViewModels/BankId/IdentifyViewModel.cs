using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using GroupProject.Anotations;

namespace GroupProject.ViewModels
{
    public class IdentifyViewModel
    {
        [Required(ErrorMessage = "Du må skrive inn et fødselsnummer")]
        [StringLength(11,ErrorMessage = "Fødselsnummer må være 11 siffer",MinimumLength = 11)]
        [BirthNumber(ErrorMessage = "Fødselsnummeret er ugyldig")]
        public String Fødselsnummer { get; set; }


    }
}

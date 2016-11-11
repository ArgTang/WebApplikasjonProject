
﻿using System.Collections.Generic;
using GroupProject.DAL;
using System.ComponentModel.DataAnnotations;
using GroupProject.Annotations;

namespace GroupProject.ViewModels.Admin
{
    public class SearchViewModel
    {
        [Required(ErrorMessage = "Du må skrive inn et personnummer")]
        [RegularExpression("[0-9]{11}", ErrorMessage = "Ett gyldig fødselsnummer kan kun inneholde 11 siffer")]
        public string searchUser { get; set; }
    }
}
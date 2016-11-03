using System.Collections.Generic;
using GroupProject.Models;

namespace GroupProject.ViewModels.Admin
{
    public class FakturaViewModel
    {
        public List<Konto> accounts { get; set; }
        public List<Betalinger> payments { get; set; }
    }
}
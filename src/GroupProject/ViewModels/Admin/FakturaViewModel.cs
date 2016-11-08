using System.Collections.Generic;
using GroupProject.DAL;

namespace GroupProject.ViewModels.Admin
{
    public class FakturaViewModel
    {
        public List<Konto> accounts { get; set; }
        public List<Betalinger> payments { get; set; }
    }
}
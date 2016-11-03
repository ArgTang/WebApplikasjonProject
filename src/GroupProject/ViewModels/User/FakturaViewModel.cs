using System.Collections.Generic;
using GroupProject.DAL;

namespace GroupProject.ViewModels.User
{
    public class FakturaViewModel
    {
        public List<Konto> accounts { get; set; }
        public List<Betalinger> payments { get; set; }
    }
}
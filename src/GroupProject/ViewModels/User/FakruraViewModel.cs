using System.Collections.Generic;
using GroupProject.Models;

namespace GroupProject.ViewModels.User
{
    public class FakruraViewModel
    {
        public List<Konto> accounts { get; set; }
        public List<Betalinger> payments { get; set; }
    }
}
using System.Collections.Generic;
using GroupProject.Models;

namespace GroupProject.ViewModels.User
{
    public class FaktruraViewModel
    {
        public List<Konto> accounts { get; set; }
        public List<Betalinger> payments { get; set; }
    }
}
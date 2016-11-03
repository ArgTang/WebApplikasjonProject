
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace GroupProject.DAL
{
    [Table("Konto")]
    public class Konto : BaseModel
    {
        [Required(ErrorMessage = "KontoNr må skrives inn")]
        public string kontoNr { get; set; }

        [Required(ErrorMessage = "Saldo må skrives inn")]
        [Range(-10000.00, 10000000.00)]
        public decimal saldo { get; set; }

        //[Required]
        //[StringLength(30)]
        //public string kontoType { get; set; }
        public enum kontoNavn
        {
            BSU,
            Sparekonto,
            Brukskonto
        }

        public kontoNavn kontoType { get; set; }

        public virtual Person Personer { get; set; }
        [Required]
        public int PersonerId { get; set; }

        public virtual ICollection<Betalinger> betal { get; set; }
    }
}

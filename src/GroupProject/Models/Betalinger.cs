using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace GroupProject.Models
{
    [Table("Betalinger")]
    public class Betalinger : BaseModel
    {
        [Required(ErrorMessage = "Beløp må skrives inn")]
        public decimal belop { get; set; }
        
        [StringLength(100)]
        public string info { get; set; }

        public string kid { get; set; }

        public string tilKonto { get; set; }

        public string fraKonto { get; set; }

        public bool utfort { get; set; }
        
        public DateTime forfallDato { get; set; }

        public virtual Konto Kontoer { get; set; }
        [Required]
        public int KontoerId { get; set; }

        public string toName { get; internal set; }
    }
}

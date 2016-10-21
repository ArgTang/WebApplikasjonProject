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
        public double belop { get; set; }
        
        [StringLength(100)]
        public string info { get; set; }

        public bool utfort { get; set; }
        
        public DateTime datoUtfort { get; set; }

        public virtual Konto Kontoer { get; set; }

        [Required]
        public int KontoerId { get; set; }
    }
}

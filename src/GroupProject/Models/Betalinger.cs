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

        [Required]
        public string tilKonto { get; set; }
        
        [Required]
        public string fraKonto { get; set; }

        public bool utfort { get; set; }
        
        [Required]
        public DateTime forfallDato { get; set; }

        public string mottaker { get; set; }
    }
}

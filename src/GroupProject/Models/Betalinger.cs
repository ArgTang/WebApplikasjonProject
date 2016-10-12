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
        [Required]
        public int belop { get; set; }
        [Required]
        [StringLength(100)]
        public string info { get; set; }

        public virtual Konto Kontoer { get; set; }
        [Required]
        public int KontoerId { get; set; }
    }
}

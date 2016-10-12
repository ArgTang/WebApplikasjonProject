using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace GroupProject.Models
{
    [Table("Konto")]
    public class Konto : BaseModel
    {
        [Required]
        public string kontoNr { get; set; }
        [Required]
        [Range(-10000, 10000000)]
        public int saldo { get; set; }

        public virtual Person Personer { get; set; }
        [Required]
        public int PersonerId { get; set; }

        public virtual ICollection<Betalinger> betal { get; set; }
    }
}

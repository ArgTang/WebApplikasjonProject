using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace GroupProject.Models
{
    [Table("Betalinger")]
    public class Betalinger
    {
        [Key]
        public int betalingsId { get; set; }
        public int belop { get; set; }
        public string info { get; set; }
    }
}

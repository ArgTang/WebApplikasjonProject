using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace GroupProject.Models
{
    [Table("Konto")]
    public class Konto
    {
        [Key]
        public int kontoId { get; set; }
        public string kontoNr { get; set; }
        public int saldo { get; set; }
    }
}

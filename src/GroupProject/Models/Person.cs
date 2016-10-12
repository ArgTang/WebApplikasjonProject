using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace GroupProject.Models
{
    [Table("Person")]
    public class Person
    {
        [Key]
        public int PersonId { get; set; }
        public string passord { get; set; }
        public string PersonNr { get; set; }

        public virtual ICollection<Konto> konto { get; set; }

    }
}

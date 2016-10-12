using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace GroupProject.Models 
{
    [Table("Person")]
    public class Person : BaseModel
    {
        [Required]
        public string passord { get; set; }

        [Required]
        [MaxLength(11)]
        [MinLength(11)]
        public string PersonNr { get; set; }

        public virtual ICollection<Konto> konto { get; set; }

    }
}

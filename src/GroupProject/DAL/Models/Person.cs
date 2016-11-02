using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace GroupProject.DAL 
{
    [Table("Person")]
    public class Person : BaseModel
    {
        //[Required(ErrorMessage = "Passord må skrives inn")]
        //[DataType(DataType.Password)]
        //public string passord { get; set; }
       
        [Required(ErrorMessage = "PersonNr må skrives inn")]
        [StringLength(11, MinimumLength = 11)]
        public string PersonNr { get; set; }

        //[Required(ErrorMessage = "Epost må skrives inn")]
        //[StringLength(100)]
        //[DataType(DataType.EmailAddress)]
        //public string epost { get; set; }

        public virtual ICollection<Konto> konto { get; set; }

    }
}

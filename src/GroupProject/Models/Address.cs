using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace GroupProject.Models
{
    public class Address
    {
        [Key]
        public int AdressId { get; set; }
        public string Street { get; set; }
        public string City { get; set; }

        public string State { get; set; }
        public string ZipCode { get; set; }

        public int PersonId { get; set; }
        public Person MyPerson { get; set; }
    }
}

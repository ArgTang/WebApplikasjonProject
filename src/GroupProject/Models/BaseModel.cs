using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

/**
 * 
 * All models inherit these values in will be in the DB.
 * 
 */

namespace GroupProject.Models
{
    public class BaseModel
    {
        [Key]
        [Required]
        public int Id { get; set; }

        [Required]
        public DateTime CreatedDate { get; set; }

        [Required]
        [StringLength(50)]
        public string createdBy { get; set; }

        [Required]
        public DateTime UpdatedDate { get; set; }

        [Required]
        [StringLength(50)]
        public string UpdatedBy { get; set; }
    }
}

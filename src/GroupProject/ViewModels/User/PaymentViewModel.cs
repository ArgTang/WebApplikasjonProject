using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace GroupProject.ViewModels.User
{
    public class PaymentViewModel
    {
        [Required]
        [DataType(DataType.Text)]
        [Display(Name = "Fra konto", Prompt = "Kontonummer")]
        public IEnumerable<string> fromAccount { get; set; }

        [Required]
        [DataType(DataType.Text)]
        [StringLength(11,ErrorMessage ="Kontonummeret må inneholde 11 siffer"),MinLength(11)]
        [Display(Name = "Til konto", Prompt = "Kontonummer")]

        public string toAccount { get; set; }

        [Required]
        [DataType(DataType.Text)]
        [Display(Name = "Mottaker", Prompt = "Mottaker")]

        public string reciever { get; set; }

        [DataType(DataType.Text)]
        [Display(Name = "Melding", Prompt="Melding til mottaker")]
        public string paymentMessage { get; set; }

        [Required]
        [DataType(DataType.Currency)]
        [Display(Name = "Beløp")]
        public int amount { get; set; }

        [Required]
        [DataType(DataType.Currency)]
        [StringLength(2)]
        public decimal fraction { get; set; }

        [Required]
        [DataType(DataType.Text)]
        [Display(Name = "Dato", Prompt = "Dato")]
        public DateTime date { get; set; }

        [DataType(DataType.Text)]
        [StringLength(25,ErrorMessage ="KID-nummeret må være mellom 2 og 25 tegn langt"), MinLength(2)]
        [Display(Name = "KID", Prompt = "KID nummer")]
        public string kid { get; set; }
    }
}

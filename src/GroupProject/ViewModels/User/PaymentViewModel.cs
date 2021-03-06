﻿using System;
using System.ComponentModel.DataAnnotations;
using GroupProject.Annotations;

namespace GroupProject.ViewModels.User
{
    /**
     * 
     * This is where all validation display names and prompts for 
     * when the user wants to make or change a payment
     */

    public class PaymentViewModel
    {
        
        [Required(ErrorMessage = "Du må skrive inn et kontonummer.")]
        [DataType(DataType.Text)]
        [Display(Name = "Fra konto", Prompt = "Kontonummer")]
        [Unlike("toAccount", ErrorMessage = "Kan ikke overføre til samme konto")]
        public string fromAccount { get; set; }

        [Required(ErrorMessage = "Du må skrive inn et kontonummer.")]
        [DataType(DataType.Text)]        
        [StringLength(11, ErrorMessage ="Kontonummeret må inneholde 11 siffer"), MinLength(11, ErrorMessage = "Kontonummeret må inneholde 11 siffer")]
        [RegularExpression("[0-9]+", ErrorMessage = "Kontonummer kan kun inneholde tall")]
        [Unlike("fromAccount", ErrorMessage = "Kan ikke overføre fra samme konto")]
        [Display(Name = "Til konto", Prompt = "Kontonummer")]
        public string toAccount { get; set; }

        [DataType(DataType.Text)]
        [Display(Name = "Mottaker", Prompt = "Mottaker")]
        public string reciever { get; set; }

        [DataType(DataType.Text)]
        [Display(Name = "Melding", Prompt="Melding til mottaker")]
        public string paymentMessage { get; set; }

        [Required(ErrorMessage = "Du må skrive inn et beløp.")]
        [DataType(DataType.Currency)]
        [RegularExpression("[0-9]+", ErrorMessage = "Beløpet kan kun ha tall")]
        [Display(Name = "Beløp", Prompt = "Beløp")]
        public string amount { get; set; }

        [DataType(DataType.Currency)]
        [Range(0, 99)]
        [StringLength(2,ErrorMessage = "Øre kan kun være 2 siffer")]
        public string fraction { get; set; }

        [Required(ErrorMessage = "Du må skrive inn et dato.")]
        [DataType(DataType.Text)]
        [Display(Name = "Dato", Prompt = "Dato")]
        [DisplayFormat(DataFormatString = "{0:dd/MM/yyyy}", ApplyFormatInEditMode = true)]
        public DateTime date { get; set; }

        [DataType(DataType.Text)]
        [RegularExpression("[0-9]+", ErrorMessage = "KID nummer kan kun ha tall")]
        [StringLength(25,ErrorMessage ="KID-nummeret må være mellom 2 og 25 tegn langt"), MinLength(2,ErrorMessage = "KID-nummeret må være mellom 2 og 25 tegn langt")]
        [Display(Name = "KID", Prompt = "KID nummer")]
        public string kid { get; set; }
    }
}

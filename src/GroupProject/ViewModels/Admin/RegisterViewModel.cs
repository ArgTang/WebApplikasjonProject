
﻿using System.Collections.Generic;
using GroupProject.DAL;
using System.ComponentModel.DataAnnotations;
using GroupProject.Annotations;

namespace GroupProject.ViewModels.Admin
{
    public class RegisterViewModel
    {
        //fornavn
        [Required(ErrorMessage = "Dette feltet må være utfylt")]
        [DataType(DataType.Text)]
        [Display(Name = "Vennligst skriv inn ditt fornavn", Prompt = "Fornavn")]
        [StringLength(50, ErrorMessage = "Navnet kan maksimum ha 50 tegn"), MinLength(2, ErrorMessage = "Navnet må minimum ha to tegn")]
        [RegularExpression("[A-za-z æøåÆØÅ]+", ErrorMessage = "Navnet kan kun inneholde bokstaver eller mellomrom")]
        public string firstName { get; set; }

        //etternavn
        [Required(ErrorMessage = "Dette feltet må være utfylt")]
        [DataType(DataType.Text)]
        [Display(Name = "Vennligst skriv inn ditt etternavn", Prompt = "Etternavn")]
        [StringLength(50, ErrorMessage = "Navnet kan maksimum ha 50 tegn"), MinLength(2, ErrorMessage = "Navnet må minimum ha to tegn")]
        [RegularExpression("[A-za-z æøåÆØÅ]+", ErrorMessage = "Navnet kan kun inneholde bokstaver eller mellomrom")]
        public string lastName { get; set; }

        //telefon
        [DataType(DataType.PhoneNumber)]
        [Display(Name = "Vennligst skriv inn ditt telefonnummer", Prompt = "Telefonnummer")]
        [Required(ErrorMessage = "Dette feltet må være utfylt")]
        [RegularExpression("[0-9]{8}", ErrorMessage = "Telefonnummeret kan kun inneholde 8 siffer")]
        public string phonenumber { get; set; }

        //adresse
        [DataType(DataType.Text)]
        [Display(Name = "Vennligst skriv inn din adresse", Prompt = "Adresse")]
        [Required(ErrorMessage = "Dette feltet må være utfylt")]
        [StringLength(50, ErrorMessage = "Adressen kan maksimum ha 50 tegn")MinLength(2, ErrorMessage = "Adressen må minimum ha to tegn")]
        public string adresse { get; set; }

        //postnummer
        [DataType(DataType.Text)]
        [Display(Name = "Vennligst skriv inn ditt postnummer", Prompt = "Postnummer")]
        [Required(ErrorMessage = "Dette feltet må være utfylt")]
        [RegularExpression("[0-9]{4}", ErrorMessage ="Ett postnummer kan kun inneholde 4 siffer")]
        public string zipcode { get; set; }

        ////poststed
        //public string postal { get; set; }
        
        //epostadresse
        [DataType(DataType.EmailAddress)]
        [Display(Name = "Vennligst skriv inn din epostadresse", Prompt ="Epostadresse")]
        [Required(ErrorMessage ="Dette feltet må være utfylt")]
        [RegularExpression(@"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$", ErrorMessage ="Epostadressen må inneholde @ og .")]
        public string epost { get; set; }

        [Required(ErrorMessage ="Dette feltet må være utfylt")]
        [DataType(DataType.Password)]
        [Display(Name = "Vennlist skriv inn ett passord", Prompt = "Passord")]
        [RegularExpression("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{12,40}$", ErrorMessage = "Minimum 12 tegn, minst en bokstav og ett nummer")]
        public string password { get; set; }

        [Required(ErrorMessage = "Dette feltet må være utfylt")]
        [DataType(DataType.Password)]
        [Display(Name = "Vennlist skriv inn ett passord", Prompt = "Passord")]
        [RegularExpression("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{12,40}$", ErrorMessage = "Minimum 12 tegn, minst en bokstav og ett nummer")]
        [Compare("password", ErrorMessage="Passordet må være det samme som det du skrev i forrige felt")]
        public string confirmPassword { get; set; }

        //søk etter bruker
        [DataType(DataType.Text)]
        [Display(Name = "Vennligst skriv inn ett gyldig fødselsnummer", Prompt = "Fødselsnummer")]
        [Required(ErrorMessage = "Dette feltet må være utfylt")]
        [StringLength(11, ErrorMessage = "Ett gyldig fødselsnummer kan kun inneholde 11 siffer")]
        [RegularExpression("[0-9]{11}", ErrorMessage = "Ett gyldig fødselsnummer kan kun inneholde 11 siffer")]
        public string searchUser { get; set; }

        //drop down med kontotyper
        [Required(ErrorMessage = "Dette feltet må være utfylt")]
        public string kontoType { get; set; }
    }
}
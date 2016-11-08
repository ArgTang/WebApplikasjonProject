using System.ComponentModel.DataAnnotations;

namespace GroupProject.ViewModels.Admin
{
    public class RegisterViewModel
    {
        //fornavn
        [DataType(DataType.Text)]
        [Display(Name = "Vennligst skriv inn ditt fornavn", Prompt = "Fornavn")]
        [Required(ErrorMessage = "Dette feltet må være utfylt")]
        [StringLength(50, ErrorMessage = "Navnet kan maksimum ha 50 tegn"), MinLength(2, ErrorMessage = "Navnet må minimum ha to tegn")]
        [RegularExpression("/^[a-z æøå]+$/i", ErrorMessage = "Navnet kan kun inneholde bokstaver eller mellomrom")]
        public string firstName { get; set; }

        //etternavn
        [DataType(DataType.Text)]
        [Display(Name = "Vennligst skriv inn ditt etternavn", Prompt = "Etternavn")]
        [Required(ErrorMessage = "Dette feltet må være utfylt")]
        [StringLength(50, ErrorMessage = "Navnet kan maksimum ha 50 tegn"), MinLength(2, ErrorMessage = "Navnet må minimum ha to tegn")]
        [RegularExpression("/^[a-z æøå]+$/i", ErrorMessage = "Navnet kan kun inneholde bokstaver eller mellomrom")]
        public string lastName { get; set; }

        //telefon
        [DataType(DataType.PhoneNumber)]
        [Display(Name = "Vennligst skriv inn ditt telefonnummer", Prompt = "Telefonnummer")]
        [Required(ErrorMessage = "Dette feltet må være utfylt")]
        [StringLength(8, ErrorMessage = "Telefonnummeret kan kun inneholde 8 siffer")]
        [RegularExpression("/^[0-9]{8}/", ErrorMessage = "Telefonnummeret kan kun inneholde 8 siffer")]
        public string phonenumber { get; set; }

        //adresse
        [DataType(DataType.Text)]
        [Display(Name = "Vennligst skriv inn din adresse", Prompt = "Adresse")]
        [Required(ErrorMessage = "Dette feltet må være utfylt")]
        [StringLength(50, ErrorMessage = "Adressen kan maksimum ha 50 tegn")MinLength(2, ErrorMessage = "Adressen må minimum ha to tegn")]
        public string adresse { get; set; }

        //postnummer
        [DataType(DataType.Text)]
        [Display(Name = "Vennligst skriv inn ditt postnummer", Prompt = "Adresse")]
        [Required(ErrorMessage = "Dette feltet må være utfylt")]
        [StringLength(4, ErrorMessage = "Postnummeret kan kun inneholde 4 siffer")]
        [RegularExpression("/^[0-9]{4}/", ErrorMessage = "Telefonnummeret kan kun inneholde 8 siffer")]
        public string zipcode { get; set; }

        ////poststed
        //public string postal { get; set; }
        

        [DataType(DataType.EmailAddress)]
        [Display(Name ="Vennlisk skriv inn din epostadresse", Prompt ="Epostadresse")]
        [Required(ErrorMessage ="Dette feltet må være utfylt")]
        public string epost { get; set; }
    }
}
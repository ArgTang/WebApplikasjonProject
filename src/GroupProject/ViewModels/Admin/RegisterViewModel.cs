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
        [Required(ErrorMessage = "Dette feltet må være utfylt")]
        [DataType(DataType.PhoneNumber)]
        [Display(Name = "Vennligst skriv inn ditt telefonnummer", Prompt = "Telefonnummer")]
        [RegularExpression("[0-9]{8}", ErrorMessage = "Telefonnummeret kan kun inneholde 8 siffer")]
        public string phonenumber { get; set; }

        //adresse
        [Required(ErrorMessage = "Dette feltet må være utfylt")]
        [DataType(DataType.Text)]
        [Display(Name = "Vennligst skriv inn din adresse", Prompt = "Adresse")]
        [StringLength(50, ErrorMessage = "Adressen kan maksimum ha 50 tegn"),
            MinLength(2, ErrorMessage = "Adressen må minimum ha to tegn")]
        public string adresse { get; set; }

        //postnummer
        [Required(ErrorMessage = "Dette feltet må være utfylt")]
        [DataType(DataType.Text)]
        [Display(Name = "Vennligst skriv inn ditt postnummer", Prompt = "Postnummer")]
        [RegularExpression("[0-9]{4}", ErrorMessage ="Ett postnummer kan kun inneholde 4 siffer")]
        public string zipcode { get; set; }

        //epostadresse
        [Required(ErrorMessage = "Dette feltet må være utfylt")]
        [DataType(DataType.EmailAddress)]
        [Display(Name = "Vennligst skriv inn din epostadresse", Prompt ="Epostadresse")]
        [RegularExpression(@"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$", ErrorMessage ="Epostadressen må inneholde @ og .")]
        public string epost { get; set; }

        [Required(ErrorMessage ="Dette feltet må være utfylt")]
        [DataType(DataType.Password)]
        [Display(Name = "Vennligst skriv inn ett passord", Prompt = "Passord")]
        [RegularExpression("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{12,40}$", ErrorMessage = "Minimum 12 tegn, minst en bokstav og ett nummer")]
        public string password { get; set; }

        [Required(ErrorMessage = "Dette feltet må være utfylt")]
        [DataType(DataType.Password)]
        [Display(Name = "Vennligst skriv inn ett passord", Prompt = "Passord")]
        [RegularExpression("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{12,40}$", ErrorMessage = "Minimum 12 tegn, minst en bokstav og ett nummer")]
        [Compare("password", ErrorMessage="Passordet må være det samme som det du skrev i forrige felt")]
        public string confirmPassword { get; set; }

        //søk etter bruker
        [BirthNumber(ErrorMessage = "Ugyldig fødselsnummer, sjekk at du har skrevet riktig")]
        [Required(ErrorMessage = "Dette feltet må være utfylt")]
        [DataType(DataType.Text)]
        [Display(Name = "Vennligst skriv inn ett fødselsnummer", Prompt = "Fødselsnummer")]
        [RegularExpression("[0-9]{11}", ErrorMessage = "Ett gyldig fødselsnummer kan kun inneholde 11 siffer")]
        public string personNr { get; set; }
    }
}
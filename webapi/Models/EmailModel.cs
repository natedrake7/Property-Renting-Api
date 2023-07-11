using System.ComponentModel.DataAnnotations;

namespace webapi.Models
{
    public class EmailModel
    {

        public string? UserId { get; set; }

        [EmailAddress(ErrorMessage = "You must input a valid Email Address")]
        public string? Email { get; set; }

        [Required(ErrorMessage = "Password field is mandatory")]
        public string? Password { get; set; }

        [Required(ErrorMessage = "Please confirm your password"),Compare("Password",ErrorMessage="Password and Password Confirmation must match")]
        public string? ConfirmPassword { get; set; }
    }
}

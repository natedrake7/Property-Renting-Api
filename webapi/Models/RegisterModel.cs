using System.ComponentModel.DataAnnotations;

namespace webapi.Models
{
    public class RegisterModel
    {
        [Required, StringLength(50, ErrorMessage = "First Name must be at most 50 characters long and at least 1", MinimumLength = 1)]
        public string? FirstName { get; set; }

        [Required, StringLength(50, ErrorMessage = "Last Name must be at most 50 characters long and at least 1", MinimumLength = 1)]
        public string? LastName { get; set; }

        [Required]
        [EmailAddress]
        public string? Email { get; set; }

        [StringLength(10, ErrorMessage = "Phone Number must be 10 characters long", MinimumLength = 10)]
        [DataType(DataType.PhoneNumber)]
        public string? PhoneNumber { get; set; }

        [Required, StringLength(50, ErrorMessage = "Username must be at most 50 character long and at least 5", MinimumLength = 5)]
        public string? Username { get; set; }

        [Display(Name = "User wants to be a Host")]
        public bool IsHost { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "The {0} must be at least {2} and at max {1} characters long.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string? Password { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Confirm password")]
        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public string? ConfirmPassword { get; set; }

        [StringLength(30)]
        public string? HostName { get; set; }

        [StringLength(60)]
        public string? HostLocation { get; set; }

        [StringLength(1000)]
        public string? HostAbout { get; set; }

        [Required(ErrorMessage = "Your profile must have a pic!")]
        public IFormFile? ProfilePic { get; set; }
    }
}

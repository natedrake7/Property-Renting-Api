using System.ComponentModel.DataAnnotations;

namespace webapi.Models
{
    public class ReviewModel
    {
        public string? UserId { get; set; }

        [Required(ErrorMessage = "You must rate the property!"),Range(1,5,ErrorMessage = "You must rate the property!")]
        public int Rating { get; set; }

        [Required(ErrorMessage = "You must rate the property!"), Range(1, 5, ErrorMessage = "You must rate the neatness of the property!")]
        public int Cleaniness { get; set; }

        [Required(ErrorMessage = "You must rate the property!"), Range(1, 5, ErrorMessage = "You must rate the location of the property!")]
        public int Location {get; set; }

        [Required(ErrorMessage = "You must rate the property!"), Range(1, 5, ErrorMessage = "You must rate the communcation with the host services!")]
        public int Communication { get; set; }

        [Required(ErrorMessage = "You must review the property!")]
        public string? Text { get; set; }
    }
}

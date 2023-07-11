using System.ComponentModel.DataAnnotations;

namespace webapi.Models
{
    public class Review
    {
        public int Id { get; set; }

        public int HouseId { get; set; }

        public DateTime Date { get; set; }

        public string? UserId { get; set; }

        [Required, Display(Name = "Your Name"), StringLength(20)]
        public string? ReviewerName { get; set; }

        [Required, Display(Name = "Your Review"), StringLength(1000)]
        public string? Comments { get; set; }

        [Required, Display(Name = "Your Rating"), RegularExpression(@"^\d+(\.\d{1})?$", ErrorMessage = "Please enter a valid rating with one decimal place.")]
        public float ReviewScoresRating { get; set; }

        [Display(Name = "How Clean was the house?"), RegularExpression(@"^\d+(\.\d{1})?$", ErrorMessage = "Please enter a valid rating with one decimal place.")]
        public float ReviewScoresCleanliness { get; set; }

        [Display(Name = "How Clean was the house?"), RegularExpression(@"^\d+(\.\d{1})?$", ErrorMessage = "Please enter a valid rating with one decimal place.")]
        public float ReviewScoresCheckin { get; set; }

        [Display(Name = "Was the communcation with the host good?"), RegularExpression(@"^\d+(\.\d{1})?$", ErrorMessage = "Please enter a valid rating with one decimal place.")]
        public float ReviewScoresCommunication { get; set; }

        [Display(Name = "Was the location good?"), RegularExpression(@"^\d+(\.\d{1})?$", ErrorMessage = "Please enter a valid rating with one decimal place.")]
        public float ReviewScoresLocation { get; set; }

        [Display(Name = "Was the experience worth the cost?"), RegularExpression(@"^\d+(\.\d{1})?$", ErrorMessage = "Please enter a valid rating with one decimal place.")]
        public float ReviewScoresValue { get; set; }

        public House? House { get; set; }

        public User? User { get; set; }
    }
}

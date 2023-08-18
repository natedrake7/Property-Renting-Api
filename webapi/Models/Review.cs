using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace webapi.Models
{
    public class Review
    {
        public int Id { get; set; }

        public int HouseId { get; set; }

        public DateTime Date { get; set; }

        public string? UserId { get; set; }

        [Required, StringLength(20)]
        public string? ReviewerName { get; set; }

        [Required, StringLength(1000)]
        public string? Comments { get; set; }

        [Required]
        public float ReviewScoresRating { get; set; }

        public float ReviewScoresCleanliness { get; set; }

        public float ReviewScoresCheckin { get; set; }

        public float ReviewScoresCommunication { get; set; }

        public float ReviewScoresLocation { get; set; }

        public float ReviewScoresValue { get; set; }

        [JsonIgnore]
        public House? House { get; set; }

        [JsonIgnore]
        public User? User { get; set; }
    }
}

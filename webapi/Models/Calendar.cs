using System.Text.Json.Serialization;

namespace webapi.Models
{
    public class Calendar
    {
        public int Id { get; set; }

        public int HouseId { get; set; }

        public DateTime Date { get; set; }

        public bool Available { get; set; }

        public bool Status { get; set; }

        public float Price { get; set; }

        public string? UserId { get; set; }

        [JsonIgnore]
        public House? House { get; set; }

        [JsonIgnore]
        public User? User { get; set; }
    }
}

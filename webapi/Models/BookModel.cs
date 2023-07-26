using System.ComponentModel.DataAnnotations;

namespace webapi.Models
{
    public class BookModel
    {
        [Required(ErrorMessage = "You must specify a starting date")]
        public DateTime StartDate { get; set; }

        [Required(ErrorMessage = "You must specify an ending date")]
        public DateTime EndDate { get; set; }

        public int DaysCount { get; set; }

        public float TotalPrice { get; set; }

        [Required(ErrorMessage = "You must specify the number of visitors")]
        public int VisitorsCount { get; set; }

        public string? UserId { get; set; }      
        
        public int HouseId { get; set; }

    }
}

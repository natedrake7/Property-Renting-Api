using System.ComponentModel.DataAnnotations;

namespace webapi.Models
{
    public class HouseInput
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Summary { get; set; }

        [Required(ErrorMessage = "Your property must showcase at least 1 image")]
        public IFormFile[]? Images { get; set; }

        [Required(ErrorMessage = "Your property listing must have a thumbnail")]
        public IFormFile? Thumbnail {get; set;}
    }
}

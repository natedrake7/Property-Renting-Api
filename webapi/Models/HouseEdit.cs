namespace webapi.Models
{
    public class HouseEdit
    {
        public string? Name { get; set; }
        public string? Summary { get; set; }
        public IFormFile[]? Images { get; set; }
    }
}

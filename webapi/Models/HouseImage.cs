namespace webapi.Models
{
    public class HouseImage
    {
        public int Id { get; set; }

        public string? Name { get; set; }

        public string? URL { get; set; }

        public byte[]? Image { get; set; }

        public int HouseId { get; set; }

        public House? House { get; set; }
    }
}

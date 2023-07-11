namespace webapi.Models
{
    public class HostImage
    {
        public int Id { get; set; }

        public string? URL { get; set; }

        public string? Name { get; set; }

        public byte[]? Image { get; set; }

        public int HostId { get; set; }

        public Host? Host { get; set; }
    }
}

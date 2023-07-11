namespace webapi.Models
{
    public class Error
    {
        public string? Variable { get; set; }

        public IEnumerable<string>? Errors { get; set; }
    }
}

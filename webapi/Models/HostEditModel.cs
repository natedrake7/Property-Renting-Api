namespace webapi.Models
{
    public class HostEditModel
    {
        public string? HostName { get; set; }

        public string? HostAbout { get; set; }

        public string? HostLocation { get; set;}

        public string? Languages { get; set; }

        public string? Profession { get; set; }

        public bool? HostIdentityVerified { get; set; }

        public IFormFile? ProfilePic { get; set; }
    }
}

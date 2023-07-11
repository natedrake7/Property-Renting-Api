using Microsoft.AspNetCore.Identity;

namespace webapi.Models
{
    public class User : IdentityUser
    {
        [PersonalData]
        public string? FirstName { get; set; }

        [PersonalData]
        public string? LastName { get; set; }

        public string? Bio { get; set; }

        public bool? IsHost { get; set; }

        public int HostId { get; set; } //Foreign Key

        public Host? Host { get; set; } //Navigation Property
    }
}

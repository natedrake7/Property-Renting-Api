using Microsoft.AspNetCore.Identity;

namespace webapi.Models
{
    public class Admin : IdentityUser
    {
        [PersonalData]
        public string? FirstName { get; set; }

        [PersonalData]
        public string? LastName { get; set; }
    }
}

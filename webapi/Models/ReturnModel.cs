using System.ComponentModel.DataAnnotations;

namespace webapi.Models
{
    public class ReturnModel
    {
        public string? Id { get; set; }
        public string? Username { get; set; }

        public string? FirstName { get; set; }

        public string? LastName { get; set; }

        public string? Email { get; set; }

        public string? Bio { get; set; }

        public string? PhoneNumber { get; set; }

        public bool? IsHost { get; set; }

        public int HostId { get; set; }
    }
}

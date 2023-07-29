using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace webapi.Models
{
    public class Host
    {
        public int Id { get; set; }

        public string? UserId { get; set; }

        [Required, Display(Name = "Name"), StringLength(30)]
        public string? HostName { get; set; }

        [Required, DataType(DataType.Date)]
        public DateTime HostSince { get; set; }

        [Required, StringLength(60)]
        public string? HostLocation { get; set; }

        [Required, StringLength(1000)]
        public string? HostAbout { get; set; }

        [Required(ErrorMessage = "Please state the languages you know")]
        public string? Languages { get; set; }

        [Required]
        public string? Profession { get; set; }

        public bool? HostIdentityVerified { get; set; }

        public string? HostNeighbourhood { get; set; }

        public int HostListingsCount { get; set; }

        public int HostTotalListingsCount { get; set; }


        public ICollection<House>? Houses { get; set; }

        public ICollection<HostImage>? Images { get; set; }
    }
}

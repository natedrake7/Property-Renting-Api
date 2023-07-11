using System.ComponentModel.DataAnnotations;

namespace webapi.Models
{
    public class Host
    {
        public int Id { get; set; }
        public string? UserId { get; set; }

        public string? HostUrl { get; set; }

        [Required, Display(Name = "Name"), StringLength(30)]
        public string? HostName { get; set; }

        [Required, DataType(DataType.Date)]
        public DateTime HostSince { get; set; }

        [Required, StringLength(60)]
        public string? HostLocation { get; set; }

        [Required, StringLength(1000)]
        public string? HostAbout { get; set; }

        public string? HostResponseTime { get; set; }

        public string? HostResponseRate { get; set; }

        public string? HostAcceptanceRate { get; set; }

        public bool HostIsSuperhost { get; set; }

        public string? HostThumbnailUrl { get; set; }

        public string? HostPictureUrl { get; set; }

        public string? HostNeighbourhood { get; set; }

        public int HostListingsCount { get; set; }

        public int HostTotalListingsCount { get; set; }

        public string? HostVerifications { get; set; }

        public bool HostHasProfilePic { get; set; }

        public bool HostIdentityVerified { get; set; }

        public ICollection<House>? Houses { get; set; }

        public ICollection<HostImage>? Images { get; set; }
    }
}

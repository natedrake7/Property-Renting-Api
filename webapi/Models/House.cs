namespace webapi.Models
{
    public class House
    {
        public int Id { get; set; }

        public string? ListingUrl { get; set; }

        public string? Name { get; set; }

        public string? Summary { get; set; }

        public string? Space { get; set; }

        public string? Description { get; set; }

        public string? ExperiencesOffered { get; set; }

        public string? NeighborhoodOverview { get; set; }

        public string? Notes { get; set; }

        public string? Transit { get; set; }

        public int HostId { get; set; }

        public string? Street { get; set; }

        public string? Neighbourhood { get; set; }

        public string? NeighbourhoodGroupCleansed { get; set; }

        public string? City { get; set; }

        public string? State { get; set; }

        public string? Zipcode { get; set; }

        public string? Market { get; set; }

        public string? CountryCode { get; set; }

        public string? Country { get; set; }

        public bool IsLocationExact { get; set; }

        public string? PropertyType { get; set; }

        public string? RoomType { get; set; }

        public int Accommodates { get; set; }

        public double Bathrooms { get; set; }

        public int Bedrooms { get; set; }

        public int Beds { get; set; }

        public string? BedType { get; set; }

        public string? Amenities { get; set; }

        public int SquareFeet { get; set; }

        public float Price { get; set; }

        public float WeeklyPrice { get; set; }

        public float MonthlyPrice { get; set; }

        public float SecurityDeposit { get; set; }

        public float CleaningFee { get; set; }

        public int GuestsIncluded { get; set; }

        public float ExtraPeople { get; set; }

        public int MinimumNights { get; set; }

        public int MaximumNights { get; set; }

        public string? CalendarUpdated { get; set; }

        public string? HasAvailability { get; set; }

        public int NumberOfReviews { get; set; }

        public DateTime? FirstReview { get; set; }

        public DateTime? LastReview { get; set; }

        public float ReviewScoresRating { get; set; }

        public float ReviewScoresAccuracy { get; set; }

        public float ReviewScoresCleanliness { get; set; }

        public float ReviewScoresCheckin { get; set; }

        public float ReviewScoresCommunication { get; set; }

        public float ReviewScoresLocation { get; set; }

        public float ReviewScoresValue { get; set; }

        public string? RequiresLicense { get; set; }

        public bool InstantBookable { get; set; }

        public string? CancellationPolicy { get; set; }

        public bool RequireGuestPhoneVerification { get; set; }

        public float ReviewsPerMonth { get; set; }

        public Host? Host { get; set; }

        public ICollection<HouseImage>? Images { get; set; }
    }
}

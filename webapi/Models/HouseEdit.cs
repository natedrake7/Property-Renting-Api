namespace webapi.Models
{
    public class HouseEdit
    {
        public string? Name { get; set; }

        public string? Summary { get; set; }

        public string? Space { get; set; }

        public string? ExperiencesOffered { get; set; }

        public string? Notes { get; set; }

        public string? Transit { get; set; }

        public string? Street { get; set; }

        public string? Neighborhood { get; set; }

        public string? NeighborhoodOverview { get; set; }

        public string? City { get; set; }

        public string? State { get; set; }

        public string? ZipCode { get; set; }

        public string? Market { get; set; }

        public string? CountryCode { get; set; }

        public string? Country { get; set; }

        public bool IsLocationExact { get; set; }
        public string? PropertyType { get; set; }
        public double Bathrooms { get; set; }

        public int Bedrooms { get; set; }

        public int Beds { get; set; }

        public int SquareFeet { get; set; }
        public float Price { get; set; }

        public float WeeklyPrice { get; set; }

        public float MonthlyPrice { get; set; }

        public float CleaningFee { get; set; }

        public int GuestsIncluded { get; set; }

        public float ExtraPeople { get; set; }

        public int MinimumNights { get; set; }

        public int MaximumNights { get; set; }

        public bool RequiresLicense { get; set; }

        public bool InstantBookable { get; set; }

        public string? CancellationPolicy { get; set; }

        public bool RequireGuestPhoneVerification { get; set; }

        public IFormFile[]? Images { get; set; }
    }
}

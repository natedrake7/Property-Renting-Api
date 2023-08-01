using System.Text.Json.Serialization;

namespace webapi.Models
{
    public class House
    {
        public int Id { get; set; }

        public string? Name { get; set; }

        public string? Summary { get; set; }

        public string? Space { get; set; }

        public string? ExperiencesOffered { get; set; }

        public string? NeighborhoodOverview { get; set; }

        public string? Notes { get; set; }

        public string? Transit { get; set; }

        public int HostId { get; set; }

        public string? Street { get; set; }

        public string? Neighbourhood { get; set; }

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

        public bool RequiresLicense { get; set; }

        public bool InstantBookable { get; set; }

        public string? CancellationPolicy { get; set; }

        public bool RequireGuestPhoneVerification { get; set; }

        public float ReviewsPerMonth { get; set; }

        [JsonIgnore]
        public Host? Host { get; set; }

        public List<HouseImage>? Images { get; set; }

        public List<Review>? Reviews { get; set; }

        public House(House house,List<HouseImage> images,List<Review> reviews,float meanScoresRating,float meanCleaniness, float meanCheckin, float meanCommuncation,float meanValue)
        {
            Id = house.Id;
            Name = house.Name;
            Summary = house.Summary;
            Space  = house.Space;
            ExperiencesOffered = house.ExperiencesOffered;
            NeighborhoodOverview = house.NeighborhoodOverview;
            Notes = house.Notes;
            Transit = house.Transit;
            HostId = house.HostId;
            Street = house.Street;
            Neighbourhood = house.Neighbourhood;
            City = house.City;
            State = house.State;
            Zipcode = house.Zipcode;
            Country = house.Country;
            CountryCode = house.CountryCode;
            IsLocationExact = house.IsLocationExact;
            PropertyType = house.PropertyType;
            Bathrooms = house.Bathrooms;
            Bedrooms = house.Bedrooms;
            Beds = house.Beds;
            SquareFeet = house.SquareFeet;
            Price = house.Price;
            WeeklyPrice = house.WeeklyPrice;
            MonthlyPrice = house.MonthlyPrice;
            CleaningFee = house.CleaningFee;
            ExtraPeople = house.ExtraPeople;
            MinimumNights = house.MinimumNights;
            MaximumNights = house.MaximumNights;
            RequiresLicense = house.RequiresLicense;
            InstantBookable = house.InstantBookable;
            RequireGuestPhoneVerification = house.RequireGuestPhoneVerification;
            CancellationPolicy = house.CancellationPolicy;
            ReviewScoresRating = meanScoresRating;
            ReviewScoresCleanliness = meanCleaniness;
            ReviewScoresCheckin = meanCheckin;
            ReviewScoresCommunication = meanCommuncation;
            ReviewScoresValue = meanValue;
            Reviews = new List<Review>(reviews);
            Images = new List<HouseImage>(images);
        }

        public House() { }
    }
}

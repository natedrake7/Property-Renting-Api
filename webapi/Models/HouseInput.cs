using System.ComponentModel.DataAnnotations;

namespace webapi.Models
{
    public class HouseInput
    {
        [Required(ErrorMessage = "Your property must have a name!")]
        public string? Name { get; set; }

        [Required(ErrorMessage = "You must give a summary of the property!")]
        public string? Summary { get; set; }

        [Required(ErrorMessage = "You must describe the space of the property!")]
        public string? Space { get; set; }

        [Required(ErrorMessage = "You must inform the tenants of the available experiences!")]
        public string? ExperiencesOffered { get; set; }

        public string? Notes {get; set; }

        [Required]//Should not return an error
        public string? Transit {get; set; }

        [Required(ErrorMessage = "You must state the street address of the property!")]
        public string? Street { get; set; }

        public string? Neighborhood { get; set; }

        public string? NeighborhoodOverview { get; set; }

        [Required(ErrorMessage = "You must state the city of the property!")]
        public string? City { get; set; }

        [Required(ErrorMessage = "You must state the State of the property")]
        public string? State { get; set; }

        public string? ZipCode { get; set; }

        public string? Market { get; set; }

        [Required(ErrorMessage = "You must state the country code of the country your property resides!")]
        public string? CountryCode { get; set; }

        [Required(ErrorMessage = "You must state the Country where your property resides!")]
        public string? Country { get; set; }

        public bool IsLocationExact { get; set; }

        [Required(ErrorMessage = "Please select one of the following options!")]
        public string? PropertyType { get; set; }

        [Range(1,double.MaxValue,ErrorMessage = "You must state the number of bathrooms in your property!")]
        public double Bathrooms { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "You must state the number of bedrooms in your property!")]
        public int Bedrooms { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "You must state the number of beds in your property!")]
        public int Beds{ get; set; }

        public int SquareFeet { get; set; }

        [Required(ErrorMessage = "You must state the price for each day!")]
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


        [Required(ErrorMessage = "Your property must showcase at least 1 image!")]
        public IFormFile[]? Images { get; set; }

        [Required(ErrorMessage = "Your property listing must have a thumbnail!")]
        public IFormFile? Thumbnail {get; set;}
    }
}

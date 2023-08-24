using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Encodings.Web;
using System.Text.Json.Serialization;
using System.Text.Json;
using webapi.Models;
using webapi.Data;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace webapi.Controllers
{
    public class HouseController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<User> _userManager;

        public HouseController(ApplicationDbContext context, UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetPropertyDates(int Id)
        {
            var options = new JsonSerializerOptions
            {
                Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
            };
            var House = await (from h in _context.Houses
                               where h.Id == Id
                               select h).FirstOrDefaultAsync();
            if (House == null)
                return NotFound("House not found!");
            var Calendar = await (from c in _context.UserCalendars
                                  where c.HouseId == Id
                                  select c).ToListAsync();
            if (Calendar == null)
            {
                var json = JsonSerializer.Serialize("empty", options);
                return Content(json, "application/json");
            }
            var DatesList = new List<DateTime>();
            for(int i = 0; i < Calendar.Count; i++) 
                DatesList.Add(Calendar[i].Date);

            var json2 = JsonSerializer.Serialize(DatesList, options);
            return Content(json2, "application/json");
        }

        [HttpPost]
        public async Task<IActionResult> BookProperty(int Id, [FromForm]BookModel bookmodel)
        {
            var options = new JsonSerializerOptions
            {
                Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
            };
            var user = await _userManager.FindByIdAsync(bookmodel.UserId!);
            if(user == null)
                return NotFound("User not found!");

            var House = await (from h in _context.Houses
                               where h.Id == Id
                               select h).FirstOrDefaultAsync();
            if (House == null)
                return NotFound("House not found!");
            if(!ModelState.IsValid)
            {
                var ModelErrors = ModelState
                                .Where(entry => entry.Value!.Errors.Count > 0)
                                .Select(entry => new
                                {
                                    Variable = entry.Key,
                                    Errors = entry.Value!.Errors.Select(error => error.ErrorMessage)
                                })
                                .ToList();
                var json = JsonSerializer.Serialize(ModelErrors, options);
                return Content(json, "application/json");
            }
            for(int i = 0;i < bookmodel.DaysCount;i++) 
            {
                var Calendar = new Calendar()
                {
                    HouseId = Id,
                    Date = bookmodel.StartDate.AddDays(i),
                    Price = bookmodel.TotalPrice / bookmodel.DaysCount,
                    Available = false,
                    UserId = bookmodel.UserId
                };
                _context.Add(Calendar);
            }
            await _context.SaveChangesAsync();
            var json2 = JsonSerializer.Serialize("ok", options);
            return Content(json2, "application/json");
        }

        [HttpPost]
        public async Task<IActionResult> SubmitReview(int Id,[FromForm]ReviewModel review)
        {
            var options = new JsonSerializerOptions
            {
                Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
            };
            var user  =  await _userManager.FindByIdAsync(review.UserId!);
            if(user == null)
            {
               var json = JsonSerializer.Serialize("UserError", options);
               return Content(json, "application/json");
            }
            var Calendar = await (from c in _context.UserCalendars
                                  where c.HouseId == Id && c.UserId == user.Id
                                  select c).FirstOrDefaultAsync();

            if (Calendar == null)
            {
                var json = JsonSerializer.Serialize("UserError", options);
                return Content(json, "application/json");
            }

            if (!ModelState.IsValid)
            {
                var ModelErrors = ModelState
                                .Where(entry => entry.Value!.Errors.Count > 0)
                                .Select(entry => new
                                {
                                    Variable = entry.Key,
                                    Errors = entry.Value!.Errors.Select(error => error.ErrorMessage)
                                })
                                .ToList();
                var json = JsonSerializer.Serialize(ModelErrors, options);
                return Content(json, "application/json");
            }
            var Review = new Review()
            {
                HouseId = Id,
                Date = DateTime.Now,
                ReviewerName = user.FirstName,
                UserId = review.UserId,
                ReviewScoresRating = review.Rating,
                ReviewScoresCleanliness = review.Cleaniness,
                ReviewScoresCommunication = review.Communication,
                ReviewScoresLocation = review.Location,
                Comments = review.Text
            };

            _context.Add(Review);

            await _context.SaveChangesAsync();
            var house = await(from h in _context.Houses
                              where h.Id == Id
                              select h).FirstOrDefaultAsync();
            if (house == null)
                return NotFound("Requested house not found!");
            var reviews = await(from r in _context.UserReviews
                                where r.HouseId ==  Id
                                select r).ToListAsync();
            if (reviews == null)
                return NotFound("House has no reviews!");

            float sumScoresRating = 0, sumCleaniness = 0, sumLocation = 0, sumCommuncation = 0;

            foreach (var review_val in reviews)
            {
                sumScoresRating += review_val.ReviewScoresRating; //get the total sum 
                sumCleaniness += review_val.ReviewScoresCleanliness;
                sumCommuncation += review_val.ReviewScoresCommunication;
                sumLocation += review_val.ReviewScoresLocation;
            }

            house.ReviewScoresRating = sumScoresRating / reviews.Count; //get the mean for each rating value
            house.ReviewScoresCleanliness = sumCleaniness / reviews.Count;
            house.ReviewScoresCommunication = sumCommuncation / reviews.Count;
            house.ReviewScoresLocation = sumLocation / reviews.Count;

            await _context.SaveChangesAsync();

            var json1 = JsonSerializer.Serialize("ok", options);
            return Content(json1, "application/json");
        }

        // GET: UserHouses
        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> Index()
        {
            var Houses = await _context.Houses.ToListAsync();
            var options = new JsonSerializerOptions
            {
                Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
            };
            var json = JsonSerializer.Serialize(Houses, options);
            return Content(json, "application/json");
        }


        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetThumbnail(int? id)
        {
            var image = await (from i in _context.HouseImages
                               where i.HouseId == id && i.Name == "Thumbnail"
                               select i).FirstOrDefaultAsync();
            if (image == null)
                return NotFound();
            if (image!.URL == null) //If host has input the images as jpg or png files
            {
                string base64image = Convert.ToBase64String(image.Image!); //Convert them
                string imageDataUrl = $"data:image/png;base64,{base64image}"; //Get the URL
                image.URL = imageDataUrl; //Add it to the URL name
            }
            var options = new JsonSerializerOptions
            {
                Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
            };
            var json = JsonSerializer.Serialize(image, options);
            return Content(json, "application/json");
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetImages(int? id)
        {
            var images = await (from i in _context.HouseImages //find the images of the current host
                                where i.HouseId == id
                                select i).ToListAsync();
            if (images == null)
                return NotFound();
            foreach (var image in images)
            {
                if (image!.URL == null) //If host has input the images as jpg or png files
                {
                    string base64image = Convert.ToBase64String(image.Image!); //Convert them
                    string imageDataUrl = $"data:image/png;base64,{base64image}"; //Get the URL
                    image.URL = imageDataUrl; //Add it to the URL name
                }
            }
            var options = new JsonSerializerOptions
            {
                Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
            };
            var json = JsonSerializer.Serialize(images, options);
            return Content(json, "application/json");
        }

        [HttpPost]
        public async Task<IActionResult> SetThumbnail(int? id,[FromBody]int ImageId)
        {
            var options = new JsonSerializerOptions
            {
                Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
            };
            var Images = await (from i in _context.HouseImages
                                where i.HouseId == id
                                select i).ToListAsync();
            if(Images == null) 
                return NotFound();

            foreach(var image in Images)
            {
                if(image.Id == ImageId)
                     image.Name = "Thumbnail";
                else if(image.Name == "Thumbnail")
                    image.Name = "Images";
            }
            await _context.SaveChangesAsync();
            var json = JsonSerializer.Serialize("ok", options);
            return Content(json, "application/json");
        }
        
        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> Details(int? id)
        {
            var options = new JsonSerializerOptions
            {
                Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
            };

            if (id == null || _context.Houses == null)
                return NotFound("House with given Id not found!");

            var userHouse = await _context.Houses
                                 .FirstOrDefaultAsync(m => m.Id == id);

            if (userHouse == null)
                return NotFound("No house with that Id exists!");


            var reviews = (from r in _context.UserReviews //get the reviews for the current house
                           where r.HouseId == id
                           select r).ToList();

            var images = await (from i in _context.HouseImages //find the images of the current host
                                where i.HouseId == id
                                select i).ToListAsync();
            if (images == null)
                return NotFound();
          
            foreach (var image in images)
            {
                if (image!.URL == null) //If host has input the images as jpg or png files
                {
                    string base64image = Convert.ToBase64String(image.Image!); //Convert them
                    string imageDataUrl = $"data:image/png;base64,{base64image}"; //Get the URL
                    image.URL = imageDataUrl; //Add it to the URL name
                }
            }

            House house = new (userHouse,images,reviews);
            var json = JsonSerializer.Serialize(house, options);
            return Content(json, "application/json");
        }

        [HttpPost]
        public async Task<IActionResult> Create(string? Id,[FromForm]HouseInput House)
        {
            var options = new JsonSerializerOptions
            {
                Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
            };
            var user = await _userManager.FindByIdAsync(Id!);
            if (user == null)
                return NotFound();

            using var transaction = _context.Database.BeginTransaction();
            if (ModelState.IsValid)
            {
                //Create PropertyInstance
                var userHouse = new House()
                {
                    Name = House.Name,
                    Summary = House.Summary,
                    Space = House.Space,
                    ExperiencesOffered = House.ExperiencesOffered,
                    Notes = (House.Notes != "") ? House.Notes : null,
                    Transit = House.Transit,
                    Street = House.Street,
                    Neighbourhood = House.Neighborhood,
                    City = House.City,
                    State = House.State,
                    Zipcode = House.ZipCode,
                    Market = (House.Market != "") ? House.Market : null,
                    Country = House.Country,
                    CountryCode = House.CountryCode,
                    NeighborhoodOverview = (House.NeighborhoodOverview != "") ? House.NeighborhoodOverview: null,
                    IsLocationExact = House.IsLocationExact,
                    PropertyType = House.PropertyType,
                    Bathrooms = House.Bathrooms,
                    Bedrooms = House.Bedrooms,
                    Beds = House.Beds,
                    SquareFeet = House.SquareFeet,
                    Price = House.Price,
                    WeeklyPrice = (House.WeeklyPrice != 0) ? House.WeeklyPrice : 7*House.Price,
                    MonthlyPrice = (House.MonthlyPrice != 0) ? House.MonthlyPrice : 31*House.Price,
                    CleaningFee = House.CleaningFee,
                    GuestsIncluded = House.GuestsIncluded,
                    ExtraPeople = House.ExtraPeople,
                    MinimumNights = House.MinimumNights,
                    MaximumNights = House.MaximumNights,
                    RequiresLicense = House.RequiresLicense,
                    RequireGuestPhoneVerification = House.RequireGuestPhoneVerification,
                    InstantBookable = House.InstantBookable,
                    CancellationPolicy = House.CancellationPolicy,
                    ReviewScoresCleanliness = 0,
                    ReviewScoresCommunication = 0,
                    ReviewScoresLocation = 0,
                    ReviewScoresRating = 0,
                    HostId = user.HostId
                };
                _context.Add(userHouse);
                await _context.SaveChangesAsync(); //Save changes

                var houseImage = new HouseImage()
                {
                    HouseId = userHouse.Id,
                    Name = "Thumbnail",
                    Image = ConvertFileToBytes(House.Thumbnail!)
                };
                _context.Add(houseImage);
                foreach (var image in House.Images!)
                {
                    var Image = new HouseImage()
                    {
                        HouseId = userHouse.Id,
                        Name = "Image",
                        Image = ConvertFileToBytes(image)
                    };
                    _context.Add(Image);
                }
                await _context.SaveChangesAsync(); //Save changes

                transaction.Commit();

                var json = JsonSerializer.Serialize("ok", options);
                return Content(json, "application/json");
            }
            else
            {
                var ModelErrors = ModelState
                .Where(entry => entry.Value!.Errors.Count > 0)
                .Select(entry => new
                {
                    Variable = entry.Key,
                    Errors = entry.Value!.Errors.Select(error => error.ErrorMessage)
                })
                .ToList();
                var json = JsonSerializer.Serialize(ModelErrors, options);
                return Content(json, "application/json");
            }
        }

        public byte[] ConvertFileToBytes(IFormFile file)
        {
            using (var memoryStream = new MemoryStream())
            {
                file.CopyTo(memoryStream);
                return memoryStream.ToArray();
            }
        }

        [HttpPost]
        public async Task<IActionResult> Edit(int id,[FromForm] HouseEdit House)
        {
            var options = new JsonSerializerOptions
            {
                Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                NumberHandling = JsonNumberHandling.AllowNamedFloatingPointLiterals,
                ReferenceHandler = ReferenceHandler.Preserve
            };
            var existingHouse = await _context.Houses.FindAsync(id);
            if (existingHouse == null)
                return NotFound();
            else if (id != existingHouse.Id)
                return NotFound();
            using var transaction = _context.Database.BeginTransaction();
            if (ModelState.IsValid)
            {
                try
                {
                    if(existingHouse.Name != House.Name && House.Name != null)
                        existingHouse.Name = House.Name;
                    if(existingHouse.Summary != House.Summary && House.Summary != null)
                        existingHouse.Summary = House.Summary;
                    if(existingHouse.Space != House.Space && House.Space != null)
                        existingHouse.Space = House.Space;
                    if(existingHouse.ExperiencesOffered != House.ExperiencesOffered && House.ExperiencesOffered != null)
                        existingHouse.ExperiencesOffered = House.ExperiencesOffered;
                    if(existingHouse.Notes != House.Notes && House.Notes != null)
                        existingHouse.Notes = House.Notes;
                    if(existingHouse.Transit != House.Transit && House.Transit != null)
                        existingHouse.Transit = House.Transit;
                    if (existingHouse.Street != House.Street && House.Street != null)
                        existingHouse.Street = House.Street;
                    if (existingHouse.Neighbourhood != House.Neighborhood && House.Neighborhood != null)
                        existingHouse.Neighbourhood = House.Neighborhood;
                    if (existingHouse.NeighborhoodOverview != House.NeighborhoodOverview && House.NeighborhoodOverview != null)
                        existingHouse.NeighborhoodOverview = House.NeighborhoodOverview;
                    if (existingHouse.City != House.City && House.City != null)
                        existingHouse.City = House.City;
                    if (existingHouse.State != House.State && House.State != null)
                        existingHouse.State = House.State;
                    if (existingHouse.Zipcode != House.ZipCode && House.ZipCode != null)
                        existingHouse.Zipcode = House.ZipCode;
                    if (existingHouse.Market != House.Market && House.Market != null)
                        existingHouse.Market = House.Market;
                    if (existingHouse.CountryCode != House.CountryCode && House.CountryCode != null)
                        existingHouse.CountryCode = House.CountryCode;
                    if (existingHouse.Country != House.Country && House.Country != null)
                        existingHouse.Country = House.Country;
                    if (existingHouse.IsLocationExact != House.IsLocationExact && House.IsLocationExact != false)
                        existingHouse.IsLocationExact = House.IsLocationExact;
                    if (existingHouse.PropertyType != House.PropertyType && House.PropertyType != null)
                        existingHouse.PropertyType = House.PropertyType;
                    if (existingHouse.Bathrooms != House.Bathrooms && House.Bathrooms != 0)
                        existingHouse.Bathrooms = House.Bathrooms;
                    if (existingHouse.Bedrooms != House.Bedrooms && House.Bedrooms != 0)
                        existingHouse.Bedrooms = House.Bedrooms;
                    if (existingHouse.Beds != House.Beds && House.Beds != 0)
                        existingHouse.Beds = House.Beds;
                    if (existingHouse.SquareFeet != House.SquareFeet && House.SquareFeet != 0)
                        existingHouse.SquareFeet = House.SquareFeet;
                    if (existingHouse.Price != House.Price && House.Price != 0)
                        existingHouse.Price = House.Price;
                    if (existingHouse.WeeklyPrice != House.WeeklyPrice && House.WeeklyPrice != 0)
                        existingHouse.WeeklyPrice = House.WeeklyPrice;
                    if (existingHouse.MonthlyPrice != House.MonthlyPrice && House.MonthlyPrice != 0)
                        existingHouse.MonthlyPrice = House.MonthlyPrice;
                    if (existingHouse.CleaningFee != House.CleaningFee && House.CleaningFee != 0)
                        existingHouse.CleaningFee = House.CleaningFee;
                    if (existingHouse.GuestsIncluded != House.GuestsIncluded && House.GuestsIncluded != 0)
                        existingHouse.GuestsIncluded = House.GuestsIncluded;
                    if (existingHouse.ExtraPeople != House.ExtraPeople && House.ExtraPeople != 0)
                        existingHouse.ExtraPeople = House.ExtraPeople;
                    if (existingHouse.MinimumNights != House.MinimumNights && House.MinimumNights != 0)
                        existingHouse.MinimumNights = House.MinimumNights;
                    if (existingHouse.MaximumNights != House.MaximumNights && House.MaximumNights != 0)
                        existingHouse.MaximumNights = House.MaximumNights;
                    if (existingHouse.RequiresLicense != House.RequiresLicense && House.RequiresLicense != false)
                        existingHouse.RequiresLicense = House.RequiresLicense;
                    if (existingHouse.InstantBookable != House.InstantBookable && House.InstantBookable != false)
                        existingHouse.InstantBookable = House.InstantBookable;
                    if (existingHouse.CancellationPolicy != House.CancellationPolicy && House.CancellationPolicy != null)
                        existingHouse.CancellationPolicy = House.CancellationPolicy;
                    if (existingHouse.RequireGuestPhoneVerification != House.RequireGuestPhoneVerification && House.RequireGuestPhoneVerification != false)
                        existingHouse.RequireGuestPhoneVerification = House.RequireGuestPhoneVerification;

                    await _context.SaveChangesAsync();

                    if(House.Images != null)
                    {
                        foreach (var image in House.Images)
                        {
                            var Image = new HouseImage()
                            {
                                HouseId = id,
                                Name = image.Name,
                                Image = ConvertFileToBytes(image)
                            };
                            _context.Add(Image);
                        }
                        await _context.SaveChangesAsync(); //Save changes
                    }
                    transaction.Commit();
                    var json = JsonSerializer.Serialize("ok", options);
                    return Content(json, "application/json");
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!UserHouseExists(id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }

            }
            var ModelErrors = ModelState
            .Where(entry => entry.Value!.Errors.Count > 0)
            .Select(entry => new
            {
                Variable = entry.Key,
                Errors = entry.Value!.Errors.Select(error => error.ErrorMessage)
            })
            .ToList();
            var json2 = JsonSerializer.Serialize(ModelErrors, options);
            return Content(json2, "application/json");
        }

        // POST: UserHouses/Delete/5
        [HttpPost]
        public async Task<IActionResult> Delete(int id,[FromForm]string? UserId)
        {
            var options = new JsonSerializerOptions
            {
                Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                NumberHandling = JsonNumberHandling.AllowNamedFloatingPointLiterals,
                ReferenceHandler = ReferenceHandler.Preserve
            };
            if (_context.Houses == null)
                return Problem("Entity set 'UserContext.UserHouses'  is null.");

            var userHouse = await _context.Houses.FindAsync(id);
            if (userHouse == null)
                return NotFound($"House with id {id} not found.");

            var user = await _userManager.FindByIdAsync(UserId!);
            if (user == null)
                return NotFound($"User with id {UserId} not found.");

            if (userHouse != null)
                  _context.Houses.Remove(userHouse);

            await _context.SaveChangesAsync();
            var json = JsonSerializer.Serialize("ok", options);
            return Content(json, "application/json");
        }

        private bool UserHouseExists(int id)
        {
            return (_context.Houses?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}

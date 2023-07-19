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

        // GET: UserHouses
        [AllowAnonymous]
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

        [AllowAnonymous]
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
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null || _context.Houses == null)
                return NotFound();

            var user = await _userManager.GetUserAsync(User);

            if (user == null)
                LocalRedirect("/Identity/Account/Login");

            var userHouse = await _context.Houses
                                 .FirstOrDefaultAsync(m => m.Id == id);

            if (userHouse == null)
                return NotFound();


            var reviews = (from r in _context.UserReviews //get the reviews for the current house
                           where r.HouseId == id
                           select r).ToList();

            float sumScoresRating = 0, sumCleaniness = 0, sumCheckin = 0, sumCommuncation = 0, sumValue = 0;
            foreach (var review in reviews) //for each review
            {
                sumScoresRating += review.ReviewScoresRating; //get the total sum 
                sumCleaniness += review.ReviewScoresCleanliness;
                sumCheckin += review.ReviewScoresCheckin;
                sumCommuncation += review.ReviewScoresCommunication;
                sumValue += review.ReviewScoresValue;
            }

            float meanScoresRating = sumScoresRating / reviews.Count; //get the mean for each rating value
            float meanCleaniness = sumCleaniness / reviews.Count;
            float meanCheckin = sumCheckin / reviews.Count;
            float meanCommuncation = sumCommuncation / reviews.Count;
            float meanValue = sumValue / reviews.Count;

            var options = new JsonSerializerOptions
            {
                Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                NumberHandling = JsonNumberHandling.AllowNamedFloatingPointLiterals,
                ReferenceHandler = ReferenceHandler.Preserve
            };
            var json = JsonSerializer.Serialize(userHouse, options);
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
                    //Will need to update as i increase the number of values user can change
                    existingHouse.Name = House.Name;
                    existingHouse.Summary = House.Summary;
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

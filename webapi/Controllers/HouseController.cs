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

namespace webapi.Controllers
{
    public class HouseController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signManager;
        private readonly ILogger<HouseController> _logger;

        public HouseController(ApplicationDbContext context, UserManager<User> userManager, SignInManager<User> signManager, ILogger<HouseController> logger)
        {
            _context = context;
            _userManager = userManager;
            _signManager = signManager;
            _logger = logger;
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

        // GET: UserHouses/Details/5
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
        public async Task<IActionResult> Create(string? Id,[FromBody]House userHouse)
        {
            var options = new JsonSerializerOptions
            {
                Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                NumberHandling = JsonNumberHandling.AllowNamedFloatingPointLiterals,
                ReferenceHandler = ReferenceHandler.Preserve
            };
            var user = await _userManager.FindByIdAsync(Id!);
            if (user == null)
                return NotFound();

            if (ModelState.IsValid)
            {
                _context.Add(userHouse);

                userHouse.HostId = user!.HostId;
                await _context.SaveChangesAsync();
                var json = JsonSerializer.Serialize("ok", options);
                return Content(json, "application/json");
            }
            else
            {
                var json = JsonSerializer.Serialize("ok", options);
                return Content(json, "application/json");
            }
        }

        // GET: UserHouses/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null || _context.Houses == null)
                return NotFound();

            var user = await _userManager.GetUserAsync(User);

            var userHouse = await _context.Houses.FindAsync(id);

            if (userHouse == null)
                return NotFound();

            if (user == null)
                return LocalRedirect("/Identity/Account/Login");
            else if (user.HostId != userHouse.HostId)
                return RedirectToAction("Index", "Home");

            return View(userHouse);
        }

        // POST: UserHouses/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, House userHouse)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
                return LocalRedirect("/Identity/Account/Login");

            var existingHouse = await _context.Houses.FindAsync(id);
            if (id != userHouse.Id)
                return NotFound();
            if (existingHouse == null)
                return NotFound();
            else if (id != existingHouse.Id)
                return NotFound();

            if (ModelState.IsValid)
            {
                try
                {
                    //Will need to update as i increase the number of values user can change
                    existingHouse.ListingUrl = userHouse.ListingUrl;
                    existingHouse.Name = userHouse.Name;
                    existingHouse.Summary = userHouse.Summary;
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!UserHouseExists(userHouse.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction("Index", "UserHosts");
            }
            return View(userHouse);
        }

        // GET: UserHouses/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null || _context.Houses == null)
                return NotFound();

            var userHouse = await _context.Houses
                                .Include(u => u.Host)
                                .FirstOrDefaultAsync(m => m.Id == id);

            if (userHouse == null)
                return NotFound();

            var user = await _userManager.GetUserAsync(User);


            if (user == null)
                return LocalRedirect("/Identity/Account/Login");
            else if (user.HostId != userHouse.HostId)
                return RedirectToAction("Index", "Home");

            return View(userHouse);
        }

        // POST: UserHouses/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            if (_context.Houses == null)
                return Problem("Entity set 'UserContext.UserHouses'  is null.");

            var userHouse = await _context.Houses.FindAsync(id);
            if (userHouse == null)
                return RedirectToAction("Index", "UserHosts");


            var user = await _userManager.GetUserAsync(User);

            if (user == null)
                LocalRedirect("/Identity/Account/Login");
            else if (user.HostId != userHouse.HostId)

                if (userHouse != null)
                    _context.Houses.Remove(userHouse);

            await _context.SaveChangesAsync();
            return RedirectToAction("Index", "UserHosts");
        }

        private bool UserHouseExists(int id)
        {
            return (_context.Houses?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using webapi.Models;
using webapi.Data;
using Microsoft.AspNetCore.Authorization;
using System.Text.Encodings.Web;
using System.Text.Json.Serialization;
using System.Text.Json;

namespace webapi.Controllers
{
    [AllowAnonymous]
    public class HouseImagesController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;

        public HouseImagesController(ApplicationDbContext context, SignInManager<User> signInManager, UserManager<User> userManager)
        {
            _context = context;
            _signInManager = signInManager;
            _userManager = userManager;
        }

        // GET: HouseImages
        public async Task<IActionResult> Index(int HouseID)
        {
            var userContext = await _context.HouseImages.Include(h => h.House)
                                       .Where(h => h.HouseId == HouseID).ToListAsync();
            return Json(userContext);
        }

        // GET: HouseImages/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null || _context.HouseImages == null)
            {
                return NotFound();
            }

            var houseImage = await _context.HouseImages
                .Include(h => h.House)
                .FirstOrDefaultAsync(m => m.Id == id);
            if (houseImage == null)
            {
                return NotFound();
            }

            return View(houseImage);
        }

        [HttpPost]

        public async Task<IActionResult> Create([FromForm] IFormFile File,int Id)
        {
            var options = new JsonSerializerOptions
            {
                Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                NumberHandling = JsonNumberHandling.AllowNamedFloatingPointLiterals,
                ReferenceHandler = ReferenceHandler.Preserve
            };
            var House = await _context.Houses
                               .Where(h => h.Id == Id).FirstOrDefaultAsync();
            if(House == null)
                return NotFound();
            if (ModelState.IsValid)
            {
                var houseImage = new HouseImage();
                _context.Add(houseImage);
                houseImage.HouseId = Id; //Set Foreign Key properties
                houseImage.Name = "Thumbnail";
                houseImage.Image = new byte[File!.Length]; //Initialize byte array
                houseImage.Image = ConvertFileToBytes(File); //Convert the image to bytes
                await _context.SaveChangesAsync(); //Save changes
                return Json("ok");
            }
            var ModelErrors = ModelState
                .Where(entry => entry.Value!.Errors.Count > 0)
                .Select(entry => new {
                    Variable = entry.Key,
                    Errors = entry.Value!.Errors.Select(error => error.ErrorMessage)
                })
                .ToList();
            var json = JsonSerializer.Serialize(ModelErrors, options);
            return Content(json, "application/json");

        }

        public byte[] ConvertFileToBytes(IFormFile file)
        {
            using (var memoryStream = new MemoryStream())
            {
                file.CopyTo(memoryStream);
                return memoryStream.ToArray();
            }
        }

        // GET: HouseImages/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null || _context.HouseImages == null)
            {
                return NotFound();
            }

            var houseImage = await _context.HouseImages.FindAsync(id);
            if (houseImage == null)
            {
                return NotFound();
            }
            ViewData["HouseId"] = new SelectList(_context.Houses, "Id", "Id", houseImage.HouseId);
            return View(houseImage);
        }

        // POST: HouseImages/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,URL,Image,HouseId")] HouseImage houseImage)
        {
            if (id != houseImage.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(houseImage);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!HouseImageExists(houseImage.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            ViewData["HouseId"] = new SelectList(_context.Houses, "Id", "Id", houseImage.HouseId);
            return View(houseImage);
        }

        [HttpGet]
        public async Task<IActionResult> Delete(int id)
        {
            var options = new JsonSerializerOptions
            {
                Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                NumberHandling = JsonNumberHandling.AllowNamedFloatingPointLiterals,
                ReferenceHandler = ReferenceHandler.Preserve
            };
            if (_context.HouseImages == null)
            {
                return Problem("Entity set 'UserContext.HouseImages'  is null.");
            }
            var houseImage = await _context.HouseImages.FindAsync(id);
            if (houseImage == null)
                return NotFound();
            if(houseImage.Name == "Thumbnail")
            {
                var json2 = JsonSerializer.Serialize("Cannot delete thumbnail.Set another image as thumbnail first", options);
                return Content(json2, "application/json");
            }
            _context.HouseImages.Remove(houseImage);

            await _context.SaveChangesAsync();
            var json = JsonSerializer.Serialize("ok", options);
            return Content(json, "application/json");
        }

        private bool HouseImageExists(int id)
        {
            return (_context.HouseImages?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}

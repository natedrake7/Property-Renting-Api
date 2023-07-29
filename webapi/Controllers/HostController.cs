using Microsoft.AspNetCore.Http;
using webapi.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Encodings.Web;
using System.Text.Json;
using webapi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Hosting;
using System.IdentityModel.Tokens.Jwt;
using NuGet.Common;
using System.Text.Json.Serialization;

namespace webapi.Controllers
{
    [AllowAnonymous]
    public class HostController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signManager;
        private readonly JwtHandler _jwtHandler;
        public HostController(ApplicationDbContext context, UserManager<User> userManager, SignInManager<User> signManager, JwtHandler jwtHandler)
        {
            _context = context;
            _userManager = userManager;
            _signManager = signManager;
            _jwtHandler = jwtHandler;
        }

        // GET: UserHost of current user
        [HttpGet]
        [Authorize(Roles = "Host")]
        public async Task<IActionResult> GetHost(string? Id)
        {
            var user = await _userManager.FindByIdAsync(Id!);
            if (user == null)
                return NotFound();

            var host = await (from h in _context.Hosts //get the host with the matching id
                              where h.Id == user.HostId
                              select h).FirstOrDefaultAsync();

            if (host == null) //No need to check since we have authorization
                return NotFound();

            var SigningCredentials = _jwtHandler.GetSigningCredentials();
            var claims =  _jwtHandler.GetClaims(host);
            var tokenOptions = _jwtHandler.GenerateTokenOptions(SigningCredentials, claims);
            var token = new JwtSecurityTokenHandler().WriteToken(tokenOptions);

            var options = new JsonSerializerOptions
            {
                Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
            };
            var json = JsonSerializer.Serialize(new AuthModel {Token = token}, options);
            return Content(json, "application/json");
        }

        [HttpGet]
        public async Task<IActionResult> GetImage(int Id)
        {
            var host = await(from h in _context.Hosts
                             where h.Id == Id
                             select h).FirstOrDefaultAsync();

            if (host == null) 
              return NotFound("Host not found!");

            var ProfilePic = await(from h in _context.HostImages
                                   where h.HostId == Id
                                   select h).FirstOrDefaultAsync();
            if(ProfilePic == null)
                return NotFound("Host has no profile pic!");
            if (ProfilePic!.URL == null) //If host has input the images as jpg or png files
            {
                string base64image = Convert.ToBase64String(ProfilePic.Image!); //Convert them
                string imageDataUrl = $"data:image/png;base64,{base64image}"; //Get the URL
                ProfilePic.URL = imageDataUrl; //Add it to the URL name
            }
            var options = new JsonSerializerOptions
            {
                ReferenceHandler = ReferenceHandler.Preserve,
                Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
            };
            var json = JsonSerializer.Serialize(ProfilePic,options);
            return Content(json, "application/json");
        }

        [HttpGet]
        public async Task<IActionResult>GetHouses(int Id)
        {
            var Houses = await (from h in _context.Houses
                          where h.HostId == Id
                          select h).ToListAsync();
            if(Houses == null) 
                return NotFound();
            var options = new JsonSerializerOptions
            {
                Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
            };
            var json = JsonSerializer.Serialize(Houses, options);
            return Content(json, "application/json");
        }

        // GET: UserHosts/Details/5
        public async Task<IActionResult> Details(int? id)
        {

            var host = await (from h in _context.Hosts //get the host with the matching id
                              where h.Id == id
                              select h).FirstOrDefaultAsync();

            if (host == null) //No need to check since we have authorization
                return NotFound("Host not found!");

            var options = new JsonSerializerOptions
            {
                Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
            };
            var json = JsonSerializer.Serialize(host, options);
            return Content(json, "application/json");
        }

        [HttpPost]
        public async Task<IActionResult> Edit(string?Id,[FromForm] HostEditModel Host)
        {
            var options = new JsonSerializerOptions
            {
                Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
            };
            var user = await _userManager.FindByIdAsync(Id!);         
            if(user == null) 
                return NotFound();
            var host = await _context.Hosts.FirstOrDefaultAsync(h => h.Id == user.HostId);
            if(host == null)
                return NotFound();
            if (ModelState.IsValid)
            {
                using var transaction = _context.Database.BeginTransaction();
                try
                {
                    if (host.HostName != Host.HostName && Host.HostName != null)
                        host.HostName = Host.HostName;
                    if (host.HostAbout != Host.HostAbout && Host.HostAbout != null)
                        host.HostAbout = Host.HostAbout;
                    if (host.HostLocation != Host.HostLocation && Host.HostLocation != null)
                        host.HostLocation = Host.HostLocation;
                    if (host.Languages != Host.Languages && Host.Languages != null)
                        host.Languages = Host.Languages;
                    if (host.Profession != Host.Profession && Host.Profession != null)
                        host.Profession = Host.Profession;
                    if (host.HostIdentityVerified != Host.HostIdentityVerified && Host.HostIdentityVerified != null)
                        host.HostIdentityVerified = Host.HostIdentityVerified;

                    _context.Update(host);
                    await _context.SaveChangesAsync();

                    if(Host.ProfilePic != null)
                    {
                        var previousImage = await(from h in _context.HostImages
                                                  where h.HostId == host.Id
                                                  select h).FirstOrDefaultAsync();
                        if (previousImage == null) 
                            return NotFound("No profile pic was found");
                        _context.Remove(previousImage);
                        await _context.SaveChangesAsync();

                        var hostImage = new HostImage()
                        {
                            HostId = host.Id,
                            Name = "Profile",
                            Image = ConvertFileToBytes(Host.ProfilePic!)
                        };
                        _context.Add(hostImage);
                        await _context.SaveChangesAsync(); //save changes to host
                    }
                    transaction.Commit();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!UserHostExists(host.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                var SigningCredentials = _jwtHandler.GetSigningCredentials();
                var claims = _jwtHandler.GetClaims(host);
                var tokenOptions = _jwtHandler.GenerateTokenOptions(SigningCredentials, claims);
                var token = new JwtSecurityTokenHandler().WriteToken(tokenOptions);

                var json2 = JsonSerializer.Serialize(new AuthModel { Token = token }, options);
                return Content(json2, "application/json");
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

        // GET: UserHosts/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            var user = await _userManager.GetUserAsync(User);

            if (user == null) //check if a user is logged in
                return NotFound();
            else if (user.HostId != id) //and if user is the corresponding host
                return RedirectToAction("Index", "Home");

            if (id == null || _context.Hosts == null)
                return NotFound();

            var userHost = await _context.Hosts
                .FirstOrDefaultAsync(m => m.Id == id);
            if (userHost == null)
                return NotFound();

            return View(userHost);
        }

        // POST: UserHosts/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var user = await _userManager.GetUserAsync(User);

            if (_context.Hosts == null)
                return Problem("Entity set 'UserContext.userHosts'  is null.");
            else if (user!.HostId != id)
                return RedirectToAction("Index", "Home");

            var userHost = await _context.Hosts.FindAsync(id);

            if (userHost != null)
            {
                user.IsHost = false;
                user.Host = null;
                user.HostId = -1;
                _context.Hosts.Remove(userHost);
                await _userManager.RemoveFromRoleAsync(user, "Host");
                await _userManager.AddToRoleAsync(user, "Tenant");
                await _userManager.UpdateAsync(user); //Update user values (HostId changed)
                await _signManager.RefreshSignInAsync(user); //Refresh the sign in for changes to take effect
            }

            await _context.SaveChangesAsync();
            return RedirectToAction("Index", "Home");
        }

        private bool UserHostExists(int id)
        {
            return (_context.Hosts?.Any(e => e.Id == id)).GetValueOrDefault();
        }

        public byte[] ConvertFileToBytes(IFormFile file)
        {
            using (var memoryStream = new MemoryStream())
            {
                file.CopyTo(memoryStream);
                return memoryStream.ToArray();
            }
        }
    }
}

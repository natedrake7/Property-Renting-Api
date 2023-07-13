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

namespace webapi.Controllers
{
    [AllowAnonymous]
    public class HostController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signManager;
        public HostController(ApplicationDbContext context, UserManager<User> userManager, SignInManager<User> signManager)
        {
            _context = context;
            _userManager = userManager;
            _signManager = signManager;
        }

        // GET: UserHost of current user
        [HttpGet]
        public async Task<IActionResult> GetHost(string? Id)
        {
            var user = await _userManager.FindByIdAsync(Id!); //Get current user
            if (user == null)
                return NotFound();

            var host = await (from h in _context.Hosts //get the host with the matching id
                              where h.Id == user.HostId
                              select h).FirstOrDefaultAsync();

            if (host == null) //No need to check since we have authorization
                return NotFound();

            var options = new JsonSerializerOptions
            {
                Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
            };
            var json = JsonSerializer.Serialize(host, options);
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
            if (id == null || _context.Hosts == null)
            {
                return NotFound();
            }

            var user = await _userManager.GetUserAsync(User);//Get current user

            if (user == null) //if there is no user(Authentication should take care of that)
                LocalRedirect("/Identity/Account/Login"); //Redirect to login page


            var userHost = await _context.Hosts //Get the host corresponding to the user
                .FirstOrDefaultAsync(m => m.Id == id);

            if (userHost == null) //if null,return no host (Authentication should take care of that too)
                return NotFound();

            var Images = from i in _context.HostImages //find the images of the current host
                         where i.HostId == user!.HostId
                         select i;

            var images = Images.ToList(); //Get the images
            if (images == null) //if host has no images
            {
                return View();
            }
            foreach (var image in images)
            {
                if (image!.URL == null) //If host has input the images as jpg or png files
                {
                    string base64image = Convert.ToBase64String(image.Image!); //Convert them
                    string imageDataUrl = $"data:image/png;base64,{base64image}"; //Get the URL
                    image.URL = imageDataUrl; //Add it to the URL name
                }
            }
            //Return a Model

            return View();
        }

        // POST: UserHosts/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Models.Host userHost)
        {
            var options = new JsonSerializerOptions
            {
                Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
            };
            var user = await _userManager.FindByIdAsync(userHost.UserId!);

            if (ModelState.IsValid)
            {
                _context.Add(userHost);
                userHost.UserId = user!.Id; //set foreign key
                userHost.HostSince = DateTime.Now;

                await _context.SaveChangesAsync(); //save changes to host

                user.Host = userHost; //set host navigation property
                user.HostId = userHost.Id; //and foreign key in user instance

                await _userManager.UpdateAsync(user); //Update user values (HostId changed)
                await _signManager.RefreshSignInAsync(user); //Refresh the sign in for changes to take effect
                var json2 = JsonSerializer.Serialize(userHost, options);
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

        // POST: UserHosts/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        public async Task<IActionResult> Edit([FromBody] Models.Host Host)
        {
            var options = new JsonSerializerOptions
            {
                Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
            };
            var user = await _userManager.FindByIdAsync(Host.UserId);         
            if(user == null) 
                return NotFound();
            var host = await _context.Hosts.FirstOrDefaultAsync(h => h.Id == user.HostId);
            if(host == null)
                return NotFound();
            if (ModelState.IsValid)
            {
                try
                {
                    if (host.HostName != Host.HostName && Host.HostName != "")
                        host.HostName = Host.HostName;
                    if (host.HostAbout != Host.HostAbout && Host.HostAbout != "")
                        host.HostAbout = Host.HostAbout;
                    if (host.HostLocation != Host.HostLocation && Host.HostLocation != "")
                        host.HostLocation = Host.HostLocation;
                    _context.Update(host);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!UserHostExists(Host.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                var json2 = JsonSerializer.Serialize(Host, options);
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
    }
}

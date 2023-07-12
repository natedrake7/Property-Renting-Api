﻿using System.Text;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using System.Text.Json;
using Microsoft.AspNetCore.Antiforgery;
using webapi.Models;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace airbnb.Controllers
{
    public class UserController : Controller
    {
        private readonly SignInManager<User> _signInManager;
        private readonly UserManager<User> _userManager;
        private readonly IUserStore<User> _userStore;
        private readonly IUserEmailStore<User> _emailStore;
        private readonly ILogger<UserController> _logger;
        private readonly IEmailSender _emailSender;
        private readonly IAntiforgery _antiforgery;
        public UserController(
            UserManager<User> userManager,
            IUserStore<User> userStore,
            SignInManager<User> signInManager,
            ILogger<UserController> logger,
            IEmailSender emailSender,
            IAntiforgery antiforgery)
        {
            _userManager = userManager;
            _userStore = userStore;
            _emailStore = GetEmailStore();
            _signInManager = signInManager;
            _logger = logger;
            _emailSender = emailSender;
            _antiforgery = antiforgery;
        }

        [HttpPost]
        public async Task<IActionResult> Register([FromBody] RegisterModel Input, HttpRequestMessage message)
        {
            var options = new JsonSerializerOptions
            {
                Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
            };
            if (ModelState.IsValid)
            {
                var user = CreateUser();

                user.FirstName = Input.FirstName;
                user.LastName = Input.LastName;
                user.Email = Input.Email;
                user.IsHost = Input.IsHost;
                user.PhoneNumber = Input.PhoneNumber;

                await _userStore.SetUserNameAsync(user, Input.Username, CancellationToken.None);
                await _emailStore.SetEmailAsync(user, Input.Email, CancellationToken.None);
                var result = await _userManager.CreateAsync(user, Input.Password);

                if (result.Succeeded)
                {
                    _logger.LogInformation("User created a new account with password.");

                    var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                    WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));
                    if (_userManager.Options.SignIn.RequireConfirmedAccount)
                    {
                        //return RedirectToPage("RegisterConfirmation", new { email = Input.Email, returnUrl = returnUrl });
                    }
                    else
                    {
                        await _signInManager.SignInAsync(user, isPersistent: false);
                        if (user.IsHost == true)
                        {
                            await _userManager.AddToRoleAsync(user, "Host");
                            await _signInManager.RefreshSignInAsync(user);
                        }
                        else
                        {
                            await _userManager.AddToRoleAsync(user, "Tenant");
                            await _signInManager.RefreshSignInAsync(user);
                        }
                        ReturnModel model = new()
                        {
                            Id = user.Id,
                            Username = user.UserName,
                            FirstName = user.FirstName,
                            LastName = user.LastName,
                            Email = user.Email,
                            PhoneNumber = user.PhoneNumber,
                            IsHost = user.IsHost,
                            Bio = user.Bio,
                            HostId = user.HostId,

                        };
                        var json2 = JsonSerializer.Serialize(model, options);
                        return Content(json2, "application/json");
                    }
                }
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.Description);
                }
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

        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginModel Input)
        {
            var options = new JsonSerializerOptions
            {
                Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
            };
            if (ModelState.IsValid)
            {
                var result = await _signInManager.PasswordSignInAsync(Input.UserName, Input.Password, Input.RememberMe, lockoutOnFailure: false);
                if (result.Succeeded)
                {
                    _logger.LogInformation("User logged in.");
                    var user = await _userManager.FindByNameAsync(Input.UserName);
                    if (user == null)
                        return NotFound();
                    var json2 = JsonSerializer.Serialize(user, options);
                    return Content(json2, "application/json");

                }
                else
                    ModelState.AddModelError("Account", "Invalid Login Attempt");
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
        [HttpGet]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            _logger.LogInformation("User logged out.");
            var options = new JsonSerializerOptions
            {
                Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
            };
            var json = JsonSerializer.Serialize("ok", options);
            return Content(json, "application/json");
        }

        [HttpPost]
        public async Task<IActionResult> EditEmail([FromBody]EmailModel Input)
        {
            var options = new JsonSerializerOptions
            {
                Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
            };
            var user = await _userManager.FindByIdAsync(Input.UserId);

            if (user == null)
                return NotFound();
            var CheckPassword = await _signInManager.CheckPasswordSignInAsync(user, Input.Password, false);
            if (!CheckPassword.Succeeded)
            {
                ModelState.AddModelError("Password", "Wrong Password");
            }
            if (ModelState.ErrorCount > 0)
            {
                var ModelErrors = ModelState
                                    .Where(entry => entry.Value!.Errors.Count > 0)
                                    .Select(entry => new {
                                        Variable = entry.Key,
                                        Errors = entry.Value!.Errors.Select(error => error.ErrorMessage)
                                    })
                                    .ToList();
                var json3 = JsonSerializer.Serialize(ModelErrors, options);
                return Content(json3, "application/json");
            }
            var email = await _userManager.GetEmailAsync(user);
            if(email != Input.Email)
            {
                var result = await _userManager.SetEmailAsync(user, Input.Email);
                if (!result.Succeeded) 
                    ModelState.AddModelError("Email", "Failed to change email");
            }
            await _signInManager.RefreshSignInAsync(user);
            var json2 = JsonSerializer.Serialize(user, options);
            return Content(json2, "application/json");
        }

        [HttpPost]
        public async Task<IActionResult> ChangePassword([FromBody]PasswordModel Input,string? Id)
        {
            var options = new JsonSerializerOptions
            {
                Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
            };
            var user = await _userManager.FindByIdAsync(Id);
            if (user == null)
                return NotFound();
            var CheckPassword = await _signInManager.CheckPasswordSignInAsync(user, Input.OldPassword!, false);
            if (!CheckPassword.Succeeded)
                ModelState.AddModelError("OldPassword", "Wrong Password");
            if (ModelState.ErrorCount > 0)
            {
                var ModelErrors = ModelState
                                    .Where(entry => entry.Value!.Errors.Count > 0)
                                    .Select(entry => new {
                                        Variable = entry.Key,
                                        Errors = entry.Value!.Errors.Select(error => error.ErrorMessage)
                                    })
                                    .ToList();
                var json3 = JsonSerializer.Serialize(ModelErrors, options);
                return Content(json3, "application/json");
            }
            var result = await _userManager.CheckPasswordAsync(user, Input.Password!);
            if(result == false)
            {
                var check = await _userManager.ChangePasswordAsync(user, Input.OldPassword, Input.Password);
                if (!check.Succeeded)
                    ModelState.AddModelError("Password", "An error occured when trying to set the new password");
            }
            if (ModelState.ErrorCount > 0)
            {
                var ModelErrors = ModelState
                                    .Where(entry => entry.Value!.Errors.Count > 0)
                                    .Select(entry => new {
                                        Variable = entry.Key,
                                        Errors = entry.Value!.Errors.Select(error => error.ErrorMessage)
                                    })
                                    .ToList();
                var json3 = JsonSerializer.Serialize(ModelErrors, options);
                return Content(json3, "application/json");
            }
           await _signInManager.RefreshSignInAsync(user);
           var json = JsonSerializer.Serialize(user, options);
           return Content(json, "application/json");
        }

        [HttpPost]

        public async Task<IActionResult> Edit([FromBody]ReturnModel Input,string? Id)
        {
            var options = new JsonSerializerOptions
            {
                Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
            };
            var user = await _userManager.FindByIdAsync(Id);
            if(user == null) 
                return NotFound();

            if(!ModelState.IsValid) {
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
            var phoneNumber = await _userManager.GetPhoneNumberAsync(user);
            if (Input.PhoneNumber != phoneNumber && Input.PhoneNumber != "")
            {
                var setPhoneResult = await _userManager.SetPhoneNumberAsync(user, Input.PhoneNumber);
                if (!setPhoneResult.Succeeded)
                {
                    ModelState.AddModelError("PhoneNumber", "Failed to set phone number");
                }
            }
            var username = await _userManager.GetUserNameAsync(user);
            if (Input.Username != username && Input.Username != "")
            {
                var SetUsername = await _userManager.SetUserNameAsync(user, Input.Username);
                if (!SetUsername.Succeeded)
                {
                    ModelState.AddModelError("Username", "Failed to set username");
                }
            }
            var firstname = user.FirstName;
            if (Input.FirstName != firstname && Input.FirstName != "")
            {
                user.FirstName = Input.FirstName;
                var Result = await _userManager.UpdateAsync(user);
                if (!Result.Succeeded)
                {
                    ModelState.AddModelError("Firstname", "Failed to set first name");
                }

            }
            var lastname = user.LastName;
            if (Input.LastName != lastname && Input.LastName != "")
            {
                user.LastName = Input.LastName;
                var Result = await _userManager.UpdateAsync(user);
                if (!Result.Succeeded)
                {
                    ModelState.AddModelError("Lastname", "Failed to set last name");
                }
            }
            var bio = user.Bio;
            if (Input.Bio != bio && Input.Bio != "")
            {
                user.Bio = Input.Bio;
                var Result = await _userManager.UpdateAsync(user);
                if (!Result.Succeeded)
                {
                    ModelState.AddModelError("Bio", "Failed to set bio");
                }
            }
            var email = await _userManager.GetEmailAsync(user);
            if (Input.Email != email && Input.Email != "")
            {
                user.Email = Input.Email;
            }
            if (ModelState.ErrorCount > 0)
            {
                var ModelErrors = ModelState
                                    .Where(entry => entry.Value!.Errors.Count > 0)
                                    .Select(entry => new {
                                        Variable = entry.Key,
                                        Errors = entry.Value!.Errors.Select(error => error.ErrorMessage)
                                    })
                                    .ToList();
                var json3 = JsonSerializer.Serialize(ModelErrors, options);
                return Content(json3, "application/json");
            }
            await _signInManager.RefreshSignInAsync(user);
            var json2 = JsonSerializer.Serialize(user, options);
            return Content(json2, "application/json");
        }

        [HttpPost]

        public async Task<IActionResult>Delete([FromBody]DeleteModel Input,string? Id)
        {
            var options = new JsonSerializerOptions
            {
                Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
            };
            var user = await _userManager.FindByIdAsync(Id);
            if (user == null)
                return NotFound();
            var result = await _userManager.CheckPasswordAsync(user, Input.Password!);
            if (!result)
                ModelState.AddModelError("Password", "Wrong Password");
            if (ModelState.ErrorCount > 0)
            {
                var ModelErrors = ModelState
                                    .Where(entry => entry.Value!.Errors.Count > 0)
                                    .Select(entry => new {
                                        Variable = entry.Key,
                                        Errors = entry.Value!.Errors.Select(error => error.ErrorMessage)
                                    })
                                    .ToList();
                var json3 = JsonSerializer.Serialize(ModelErrors, options);
                return Content(json3, "application/json");
            }
            var json = JsonSerializer.Serialize("correct", options);
            return Content(json, "application/json");
        }

        public async Task<IActionResult>DeleteConfirmed(string? Id)
        {
            var options = new JsonSerializerOptions
            {
                Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
            };
            var user = await _userManager.FindByIdAsync(Id);
            if (user == null)
                return NotFound();
            await _signInManager.SignOutAsync();
            
            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
                ModelState.AddModelError("Delete", "Failed to delete user");
            if (ModelState.ErrorCount > 0)
            {
                var ModelErrors = ModelState
                                    .Where(entry => entry.Value!.Errors.Count > 0)
                                    .Select(entry => new {
                                        Variable = entry.Key,
                                        Errors = entry.Value!.Errors.Select(error => error.ErrorMessage)
                                    })
                                    .ToList();
                var json3 = JsonSerializer.Serialize(ModelErrors, options);
                return Content(json3, "application/json");
            }
            var json = JsonSerializer.Serialize("done", options);
            return Content(json, "application/json");
        }

        private User CreateUser()
        {
            try
            {
                return Activator.CreateInstance<User>();
            }
            catch
            {
                throw new InvalidOperationException($"Can't create an instance of '{nameof(webapi.Models.User)}'. " +
                    $"Ensure that '{nameof(webapi.Models.User)}' is not an abstract class and has a parameterless constructor, or alternatively " +
                    $"override the register page in /Areas/Identity/Pages/Account/Register.cshtml");
            }
        }

        private IUserEmailStore<User> GetEmailStore()
        {
            if (!_userManager.SupportsUserEmail)
            {
                throw new NotSupportedException("The default UI requires a user store with email support.");
            }
            return (IUserEmailStore<User>)_userStore;
        }
    }
}
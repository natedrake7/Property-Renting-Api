using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using webapi.Models;
using webapi.Data;
using Microsoft.AspNetCore.Antiforgery;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("airbnb") 
    ?? throw new InvalidOperationException("Connection string 'airbnbContext' not found.")));

builder.Services.AddDefaultIdentity<User>(options => options.SignIn.RequireConfirmedAccount = false)
                .AddRoles<IdentityRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();


builder.Services.AddScoped<RoleManager<IdentityRole>>();
builder.Services.AddScoped<Roles>();
builder.Services.AddScoped<IRoleInitializer, Roles>();

builder.Services.AddCors(options =>
                 options.AddDefaultPolicy(builder =>
                 {
                     builder.AllowAnyOrigin()
                            .AllowAnyHeader()
                            .AllowAnyMethod();
                 })
                 );
builder.Services.AddAntiforgery(options =>
{
    options.Cookie.Name = "XSRF-TOKEN";
    options.HeaderName = "X-XSRF-TOKEN";
});
builder.Services.AddRazorPages();

builder.Services.Configure<IdentityOptions>(options =>
{
    //Set password settings
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequiredLength = 8;
    options.Password.RequiredUniqueChars = 1;
    //Set Lockout settings
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
    options.Lockout.MaxFailedAccessAttempts = 4;
    options.Lockout.AllowedForNewUsers = true;

    //User settings
    options.User.RequireUniqueEmail = true;
    options.User.AllowedUserNameCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+";

});

builder.Services.ConfigureApplicationCookie(options =>
{
    // Cookie settings
    options.Cookie.HttpOnly = false;
});
// Add services to the container.

builder.Services.AddControllersWithViews();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var roleInitializer = scope.ServiceProvider.GetRequiredService<Roles>();
    await roleInitializer.InitializeRolesAsync();
}


// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

var antiforgery = app.Services.GetRequiredService<IAntiforgery>();

app.Use((context, next) =>
{
    var requestPath = context.Request.Path.Value;

    if (string.Equals(requestPath, "/", StringComparison.OrdinalIgnoreCase)
        || string.Equals(requestPath, "/register", StringComparison.OrdinalIgnoreCase))
    {
        var tokenSet = antiforgery.GetAndStoreTokens(context);
        context.Response.Cookies.Append("XSRF-TOKEN", tokenSet.RequestToken!,
            new CookieOptions { HttpOnly = false });
    }

    return next(context);
});

app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.UseCors();

app.MapControllerRoute(
    name: "Default",
    pattern: "{controller=Home}/{action=Index}"
    );

app.MapControllerRoute(
    name: "GetHost",
    pattern: "{controller=Host}/{action=GetHost}/{id}");

app.MapControllerRoute(
    name: "EditUser",
    pattern: "{controller=User}/{action=Edit}/{id}");

app.MapControllerRoute(
    name: "ChangePassword",
    pattern: "{controller=User}/{action=ChangePassword}/{id}");

app.MapControllerRoute(
    name: "ChangePassword",
    pattern: "{controller=User}/{action=Delete}/{id}");

app.MapControllerRoute(
    name: "ChangePassword",
    pattern: "{controller=User}/{action=DeleteConfirmed}/{id}");

app.MapControllerRoute(
    name: "CreateProperty",
    pattern: "{controller=House}/{action=Create}/{id}");

app.MapControllerRoute(
    name: "GetProperties",
    pattern: "{controller=Host}/{action=GetHouses}/{id}");

app.Run();

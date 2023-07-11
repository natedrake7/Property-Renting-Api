using Microsoft.AspNetCore.Identity;

namespace webapi.Models
{
    public interface IRoleInitializer
    {
        Task InitializeRolesAsync();
    }

    public class Roles : IRoleInitializer
    {
        private readonly RoleManager<IdentityRole> _roleManager;

        public Roles(RoleManager<IdentityRole> roleManager)
        {
            _roleManager = roleManager;
        }
        public async Task InitializeRolesAsync()
        {
            if (!await _roleManager.RoleExistsAsync("Admin"))
            {
                await _roleManager.CreateAsync(new IdentityRole("Admin"));
            }
            if (!await _roleManager.RoleExistsAsync("Host"))
            {
                await _roleManager.CreateAsync(new IdentityRole("Host"));
            }
            if (!await _roleManager.RoleExistsAsync("Tenant"))
            {
                await _roleManager.CreateAsync(new IdentityRole("Tenant"));
            }

        }
    }
}

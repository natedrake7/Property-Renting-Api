using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using NuGet.Packaging;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace webapi.Models
{
    public class JwtHandler
    {
        private readonly IConfiguration _configuration;
        private readonly IConfigurationSection _jwtSettings;
        private readonly UserManager<User> _userManager;
        public JwtHandler(IConfiguration configuration,UserManager<User> usermanager)
        {
            _configuration = configuration;
            _jwtSettings = _configuration.GetSection("JwtSettings");
            _userManager = usermanager;
        }
        public SigningCredentials GetSigningCredentials()
        {
            var key = Encoding.UTF8.GetBytes(_jwtSettings.GetSection("securityKey").Value!);
            var secret = new SymmetricSecurityKey(key);
            return new SigningCredentials(secret, SecurityAlgorithms.HmacSha256);
        }
        public async Task<List<Claim>> GetClaims(User user)
        {
            var claims = new List<Claim>
            {
                new Claim("Id", user.Id ?? ""),
                new Claim("username", user.UserName ?? ""),
                new Claim("FirstName", user.FirstName ?? ""),
                new Claim("LastName", user.LastName ?? ""),
                new Claim("PhoneNumber", user.PhoneNumber ?? ""),
                new Claim("Email", user.Email ?? "")
            };

            var roles = await _userManager.GetRolesAsync(user);
            foreach(var role in roles) 
            {
              
                claims.Add(new Claim(ClaimTypes.Role, role));
            }
             if(user.Bio != null)
               claims.Add(new Claim("Bio", user.Bio));
            return claims;
        }

        public List<Claim> GetClaims(Host host)
        {
            var claims = new List<Claim>
            {
                new Claim("username", host.HostName?? ""),
                new Claim("Id", host.Id.ToString()?? "")
            };
            if (host.HostAbout != null)
                claims.Add(new Claim("About", host.HostAbout?? ""));
            if (host.HostLocation != null)
                claims.Add(new Claim("Location", host.HostLocation?? "") );

            return claims;
        }
        public JwtSecurityToken GenerateTokenOptions(SigningCredentials signingCredentials, List<Claim> claims)
        {
            var tokenOptions = new JwtSecurityToken(
                issuer: _jwtSettings["validIssuer"],
                audience: _jwtSettings["validAudience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(Convert.ToDouble(_jwtSettings["expiryInMinutes"])),
                signingCredentials: signingCredentials);
            return tokenOptions;
        }
    }
}

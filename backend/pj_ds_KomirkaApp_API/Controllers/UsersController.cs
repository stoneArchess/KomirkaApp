using System;
using System.Collections.Generic;
using System.Configuration;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Policy;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using pj_ds_KomirkaApp_API;
using pj_ds_KomirkaApp_API.Models;

namespace pj_ds_KomirkaApp_API.Controllers
{


    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly Context _context;
        private readonly IPasswordHasher<User> _hasher;
        private readonly IConfiguration _cfg;
        public UsersController(Context context,IPasswordHasher<User> hasher, IConfiguration cfg)
        {
            _context = context;
            _hasher = hasher;
            _cfg = cfg;
        }


        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                return BadRequest("Email already in use.");


            var userInfo = new UserInfo
            {
                Name = dto.Name,
            };

            var user = new User
            {
                UserInfo = userInfo,
                Email = dto.Email,
                PasswordHash = _hasher.HashPassword(null!, dto.Password),
            };
            _context.UsersInfo.Add(userInfo);
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var token = CreateJwt(user);
            return Ok(new { token });
        }

        
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Email == dto.Email);
            if (user is null)
                return Unauthorized("Invalid credentials.");

            var result = _hasher.VerifyHashedPassword(user, user.PasswordHash, dto.Password);
            if (result != PasswordVerificationResult.Success)
                return Unauthorized("Invalid credentials.");

            var token = CreateJwt(user);
            return Ok(new { token });
        }

        // gets info from the user
        [HttpGet("me")]
        [Authorize]
        public async Task<ActionResult<MeDto>> Me()
        {
            var idString = User.FindFirstValue(ClaimTypes.NameIdentifier)
                        ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            var user = await _context.Users.FindAsync(int.Parse(idString));
            return new MeDto(user!.Email, user.UserInfo.Name);
        }






        // helper methods
        private string CreateJwt(User user)
        {
            var claims = new[]
            {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
        };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_cfg["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _cfg["Jwt:Issuer"],
                audience: _cfg["Jwt:Issuer"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }


        // DTOs
        public record RegisterDto(string Email, string Name, string Password);
        public record LoginDto(string Email, string Password);
        public record MeDto(string Email, string Name);
    }
}

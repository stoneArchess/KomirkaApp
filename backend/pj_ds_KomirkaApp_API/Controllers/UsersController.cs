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

    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.WebUtilities;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.IdentityModel.Tokens;
    using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;
    using System.IdentityModel.Tokens.Jwt;
    using System.Security.Claims;
    using System.Text;

    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly Context _context;          
        private readonly UserManager<User> _users;       
        private readonly SignInManager<User> _signIn;
        private readonly IConfiguration _cfg;

        public UsersController(
            Context db,
            UserManager<User> users,
            IConfiguration cfg)
        {
            _context = db;
            _users = users;
            _cfg = cfg;
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            var res = await _users.FindByEmailAsync(dto.Email);
            if ( res is not null)
                return BadRequest("Email already in use.");

            var userInfo = new UserInfo { Name = dto.Name };

            var user = new User
            {
                // identity requires username, its the same as email, name should be treated more as a Display name, for now at least
                UserName = dto.Email,   
                Email = dto.Email,
                UserInfo = userInfo
            };
               
            var create = await _users.CreateAsync(user, dto.Password);
            if (!create.Succeeded)
                return BadRequest(create.Errors.Select(e => e.Description));

            await _context.SaveChangesAsync();


            var jwt = CreateJwt(user);
            return Ok(new { token = jwt });
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = await _users.FindByEmailAsync(dto.Email);
            if (user is null)
                return Unauthorized("Invalid credentials.");

            if (!user.EmailConfirmed)
                return Unauthorized("Please verify your e‑mail first.");

            var ok = await _users.CheckPasswordAsync(user, dto.Password);
            if (!ok)
                return Unauthorized("Invalid credentials.");

            var jwt = CreateJwt(user);
            return Ok(new { token = jwt });
        }



        [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpGet("me")]
        public async Task<ActionResult<MeDto>> Me()
        {
            var idClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!int.TryParse(idClaim, out var userId))
                return Unauthorized();          

            var user = await _context.Users
                                     .Include(u => u.UserInfo)
                                     .SingleOrDefaultAsync(u => u.Id == userId);

            if (user is null) return NotFound();

            return new MeDto(user.Email, user.UserInfo.Name);
        }

        [HttpPut("me")]
        [Authorize]
        public async Task<IActionResult> UpdateMe(UpdateProfileDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var user = await _context.Users
                                .Include(u => u.UserInfo)
                                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user is null) return Unauthorized();

            if (!string.IsNullOrWhiteSpace(dto.Name))
                user.UserInfo.Name = dto.Name;

            if (!string.IsNullOrWhiteSpace(dto.Description))
                user.UserInfo.Description = dto.Description;

            if (!string.IsNullOrWhiteSpace(dto.Region))
                user.UserInfo.Region = dto.Region;

            if (!string.IsNullOrWhiteSpace(dto.Theme))
                user.UserInfo.Theme = dto.Theme;

            if (!string.IsNullOrWhiteSpace(dto.Email) && dto.Email != user.Email)
            {
                if (await _users.FindByEmailAsync(dto.Email) is not null)
                    return BadRequest("Email already in use.");

                user.Email = dto.Email;
                user.UserName = dto.Email;
            }

            if (!string.IsNullOrWhiteSpace(dto.NewPassword))
            {
                var ok = !string.IsNullOrWhiteSpace(dto.CurrentPassword) &&
                         await _users.CheckPasswordAsync(user, dto.CurrentPassword);

                if (!ok) return BadRequest("Current password is incorrect.");

                var reset = await _users.ChangePasswordAsync(user, dto.CurrentPassword, dto.NewPassword);
                if (!reset.Succeeded)
                    return BadRequest(reset.Errors.Select(e => e.Description));
            }

            await _context.SaveChangesAsync();

            var jwt = CreateJwt(user);
            return Ok(new { token = jwt });
        }



        [HttpPost("verify")]
        [AllowAnonymous]
        public async Task<IActionResult> Verify(VerifyDto dto)
        {
            var user = await _users.FindByIdAsync(dto.UserId.ToString());
            if (user is null) return NotFound();

            if (user.EmailConfirmed) return Ok("Already confirmed.");

            var token = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(dto.Code));
            var result = await _users.ConfirmEmailAsync(user, token);              

            if (!result.Succeeded) return BadRequest("Invalid or expired code.");

            var jwt = CreateJwt(user);
            return Ok(new { token = jwt });
        }

        [HttpGet("transactions")]
        [Authorize]
        public async Task<ActionResult<MeDto>> GetTransactions()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var transactions = await _context.Transactions
                                  .Include(t => t.Cell)
                                  .Include(t => t.User)
                                  .Select( t => t.User.Id == userId)
                                  .ToListAsync();

            return Ok(transactions);
        }


        private string CreateJwt(User user)
        {
            var claims = new[]
            {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email!),
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




        public record RegisterDto(string Email, string Name, string Password);
        public record LoginDto(string Email, string Password);
        public record MeDto(string Email, string Name);
        public record VerifyDto(int UserId, string Code);
        public record UpdateProfileDto(
            string? Name,
            string? Description,
            string? Region,
            string? Theme,
            string? Email,           
            string? CurrentPassword, 
            string? NewPassword);
    }

}

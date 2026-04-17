using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using OnlineExam.Api.Data;
using OnlineExam.Api.DTOs;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace OnlineExam.Api.Controllers
{
    [ApiController]
    [Route("auth")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IConfiguration _config;

        public AuthController(AppDbContext db, IConfiguration config)
        {
            _db = db;
            _config = config;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequestDto dto)
        {
            var user = _db.Users.FirstOrDefault(u => u.Email == dto.Email);

            if (user == null || !user.IsActive || !PasswordMatches(user.PasswordHash, dto.Password))
                return Unauthorized("Invalid credentials");

            if (string.IsNullOrWhiteSpace(user.PasswordHash))
                return Unauthorized("Invalid credentials");

            var isValid = false;

            // Backward compatibility for old plaintext records:
            // accept once, then transparently upgrade to a BCrypt hash.
            if (IsBcryptHash(user.PasswordHash))
            {
                try
                {
                    isValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);
                }
                catch (BCrypt.Net.SaltParseException)
                {
                    isValid = false;
                }
            }
            else
            {
                isValid = user.PasswordHash == dto.Password;
                if (isValid)
                {
                    user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
                    _db.SaveChanges();
                }
            }

            if (!isValid)
                return Unauthorized("Invalid credentials");

            var jwtKey = _config["Jwt:Key"];
            var jwtIssuer = _config["Jwt:Issuer"];

            if (string.IsNullOrEmpty(jwtKey) || string.IsNullOrEmpty(jwtIssuer))
                return StatusCode(500, "JWT config missing");

            var key = Encoding.UTF8.GetBytes(jwtKey);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(24),
                Issuer = jwtIssuer,
                Audience = jwtIssuer,
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256
                )
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return Ok(new LoginResponseDto
            {
                Token = tokenHandler.WriteToken(token),
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role
            });
        }

        [Authorize]
        [HttpGet("me")]
        public IActionResult Me()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var email = User.FindFirst(ClaimTypes.Name)?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;

            return Ok(new
            {
                userId,
                email,
                role
            });
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("admin/ping")]
        public IActionResult Ping()
        {
            return Ok("Hello Admin!");
        }

 feature/exam-fixes-and-logo
        private static bool IsBcryptHash(string value)
        {
            return value.StartsWith("$2a$") || value.StartsWith("$2b$") || value.StartsWith("$2y$");

        private static bool PasswordMatches(string storedHash, string inputPassword)
        {
            if (string.IsNullOrWhiteSpace(storedHash) || string.IsNullOrWhiteSpace(inputPassword))
                return false;

            if (storedHash == inputPassword)
                return true;

            return BCrypt.Net.BCrypt.Verify(inputPassword, storedHash);
 main
        }
    }
}

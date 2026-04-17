using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnlineExam.Api.Data;
using OnlineExam.Api.DTOs;
using OnlineExam.Api.Models;

namespace OnlineExam.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class UsersController : ControllerBase
    {
        private static readonly string[] AllowedRoles = ["Admin", "Professor", "Assistant", "Student"];
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserDto dto)
        {
            if (!IsRoleAllowed(dto.Role))
                return BadRequest(new { message = "Role must be Admin, Professor, Assistant, or Student." });

            if (string.IsNullOrWhiteSpace(dto.Password) || dto.Password.Length < 6)
                return BadRequest(new { message = "Password must be at least 6 characters long." });

            if (await _context.Users.AnyAsync(x => x.Email == dto.Email.Trim().ToLower()))
                return Conflict(new { message = "Email already exists." });

            var user = BuildUser(dto.Email, dto.FullName, dto.Role, dto.Password, dto.IsActive);

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, ToResponse(user));
        }

        [HttpPost("import")]
        public async Task<IActionResult> ImportUsers([FromBody] ImportUsersDto dto)
        {
            if (dto.Users.Count == 0)
                return BadRequest(new { message = "At least one user row is required." });

            var importedUsers = new List<object>();
            var errors = new List<object>();

            foreach (var row in dto.Users)
            {
                var normalizedEmail = row.Email.Trim().ToLowerInvariant();
                var password = ResolvePassword(dto, row);

                if (string.IsNullOrWhiteSpace(normalizedEmail))
                {
                    errors.Add(new { email = row.Email, message = "Email is required." });
                    continue;
                }

                if (string.IsNullOrWhiteSpace(row.FullName))
                {
                    errors.Add(new { email = normalizedEmail, message = "Full name is required." });
                    continue;
                }

                if (!IsRoleAllowed(row.Role))
                {
                    errors.Add(new { email = normalizedEmail, message = "Invalid role." });
                    continue;
                }

                if (string.IsNullOrWhiteSpace(password) || password.Length < 6)
                {
                    errors.Add(new { email = normalizedEmail, message = "Password must be at least 6 characters long." });
                    continue;
                }

                if (await _context.Users.AnyAsync(x => x.Email == normalizedEmail))
                {
                    errors.Add(new { email = normalizedEmail, message = "Email already exists." });
                    continue;
                }

                var user = BuildUser(normalizedEmail, row.FullName, row.Role, password, row.IsActive);
                _context.Users.Add(user);

                importedUsers.Add(new
                {
                    user.Id,
                    user.Email,
                    user.FullName,
                    user.Role,
                    TemporaryPassword = dto.GeneratePasswords && string.IsNullOrWhiteSpace(row.Password) && string.IsNullOrWhiteSpace(dto.DefaultPassword)
                        ? password
                        : null
                });
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                requested = dto.Users.Count,
                imported = importedUsers.Count,
                failed = errors.Count,
                users = importedUsers,
                errors
            });
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _context.Users
                .Select(user => new UserResponseDto
                {
                    Id = user.Id,
                    Email = user.Email,
                    FullName = user.FullName,
                    Role = user.Role,
                    IsActive = user.IsActive,
                    CreatedAt = user.CreatedAt
                })
                .ToListAsync();

            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(Guid id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound();

            return Ok(ToResponse(user));
        }

        private static bool IsRoleAllowed(string role) =>
            AllowedRoles.Contains(role?.Trim(), StringComparer.OrdinalIgnoreCase);

        private static User BuildUser(string email, string fullName, string role, string password, bool isActive)
        {
            return new User
            {
                Id = Guid.NewGuid(),
                Email = email.Trim().ToLowerInvariant(),
                FullName = fullName.Trim(),
                Role = role.Trim(),
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
                IsActive = isActive,
                CreatedAt = DateTime.UtcNow
            };
        }

        private static string ResolvePassword(ImportUsersDto dto, ImportUserRowDto row)
        {
            if (!string.IsNullOrWhiteSpace(row.Password))
                return row.Password.Trim();

            if (!string.IsNullOrWhiteSpace(dto.DefaultPassword))
                return dto.DefaultPassword.Trim();

            return dto.GeneratePasswords ? $"Temp{Guid.NewGuid():N}"[..12] : string.Empty;
        }

        private static UserResponseDto ToResponse(User user)
        {
            return new UserResponseDto
            {
                Id = user.Id,
                Email = user.Email,
                FullName = user.FullName,
                Role = user.Role,
                IsActive = user.IsActive,
                CreatedAt = user.CreatedAt
            };
        }
    }
}

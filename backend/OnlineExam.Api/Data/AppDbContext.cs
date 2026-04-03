using Microsoft.EntityFrameworkCore;
using OnlineExam.Api.Models;

namespace OnlineExam.Api.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Seed demo users (password: Password123!)
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = Guid.NewGuid(),
                    FullName = "Admin User",
                    Email = "admin@onlineexam.com",
                    PasswordHash = "Password123!", // Real project: ALWAYS use hashed passwords!
                    Role = "Admin",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new User
                {
                    Id = Guid.NewGuid(),
                    FullName = "Professor",
                    Email = "prof@onlineexam.com",
                    PasswordHash = "Password123!",
                    Role = "Professor",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new User
                {
                    Id = Guid.NewGuid(),
                    FullName = "Student",
                    Email = "student@onlineexam.com",
                    PasswordHash = "Password123!",
                    Role = "Student",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                }
            );
        }
    }
}
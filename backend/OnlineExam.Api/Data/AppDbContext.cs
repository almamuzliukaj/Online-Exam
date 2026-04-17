using Microsoft.EntityFrameworkCore;
using OnlineExam.Api.Models;

namespace OnlineExam.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

        public DbSet<User> Users { get; set; }
        public DbSet<Exam> Exams { get; set; }
        public DbSet<ExamAttempt> ExamAttempts { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<Term> Terms { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<CourseOffering> CourseOfferings { get; set; }

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
                    PasswordHash = "Password123!",
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

            // FK: Exam → Questions (one-to-many)
            modelBuilder.Entity<Question>()
                .HasOne(q => q.Exam)
                .WithMany(e => e.Questions)
                .HasForeignKey(q => q.ExamId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ExamAttempt>()
                .HasOne(a => a.Exam)
                .WithMany(e => e.Attempts)
                .HasForeignKey(a => a.ExamId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ExamAttempt>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(a => a.StudentId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}

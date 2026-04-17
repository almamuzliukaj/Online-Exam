using Microsoft.EntityFrameworkCore;
using OnlineExam.Api.Models;

namespace OnlineExam.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Exam> Exams { get; set; }
    public DbSet<Question> Questions { get; set; }
    public DbSet<Term> Terms { get; set; }
    public DbSet<Course> Courses { get; set; }
    public DbSet<CourseOffering> CourseOfferings { get; set; }
    public DbSet<CourseOfferingStaffAssignment> CourseOfferingStaffAssignments { get; set; }
    public DbSet<SemesterEnrollment> SemesterEnrollments { get; set; }
    public DbSet<StudentCourseEnrollment> StudentCourseEnrollments { get; set; }
    public DbSet<CarryOverCourse> CarryOverCourses { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>().HasData(
            new User
            {
                Id = Guid.Parse("27f24067-053e-4af5-80de-2e508d57b0ee"),
                FullName = "Admin User",
                Email = "admin@onlineexam.com",
                PasswordHash = "Password123!",
                Role = "Admin",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new User
            {
                Id = Guid.Parse("17ef169c-c82d-44e3-8d24-e1fdc6ecf3be"),
                FullName = "Professor",
                Email = "prof@onlineexam.com",
                PasswordHash = "Password123!",
                Role = "Professor",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new User
            {
                Id = Guid.Parse("9cf9ce95-11b4-4da4-9e57-5ac0d787d651"),
                FullName = "Student",
                Email = "student@onlineexam.com",
                PasswordHash = "Password123!",
                Role = "Student",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            }
        );

        modelBuilder.Entity<Question>()
            .HasOne(q => q.Exam)
            .WithMany(e => e.Questions)
            .HasForeignKey(q => q.ExamId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Term>()
            .HasIndex(x => x.Code)
            .IsUnique();

        modelBuilder.Entity<Course>()
            .HasIndex(x => x.Code)
            .IsUnique();

        modelBuilder.Entity<CourseOffering>()
            .HasIndex(x => new { x.CourseId, x.TermId, x.SectionCode })
            .IsUnique();

        modelBuilder.Entity<StudentCourseEnrollment>()
            .HasIndex(x => new { x.StudentId, x.CourseOfferingId })
            .IsUnique();

        modelBuilder.Entity<CourseOffering>()
            .HasOne(x => x.Course)
            .WithMany(x => x.CourseOfferings)
            .HasForeignKey(x => x.CourseId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<CourseOffering>()
            .HasOne(x => x.Term)
            .WithMany(x => x.CourseOfferings)
            .HasForeignKey(x => x.TermId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<CourseOfferingStaffAssignment>()
            .HasOne(x => x.CourseOffering)
            .WithMany(x => x.StaffAssignments)
            .HasForeignKey(x => x.CourseOfferingId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<SemesterEnrollment>()
            .HasOne(x => x.Term)
            .WithMany(x => x.SemesterEnrollments)
            .HasForeignKey(x => x.TermId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<StudentCourseEnrollment>()
            .HasOne(x => x.CourseOffering)
            .WithMany(x => x.StudentCourseEnrollments)
            .HasForeignKey(x => x.CourseOfferingId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<StudentCourseEnrollment>()
            .HasOne(x => x.LinkedSemesterEnrollment)
            .WithMany(x => x.StudentCourseEnrollments)
            .HasForeignKey(x => x.LinkedSemesterEnrollmentId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<CarryOverCourse>()
            .HasOne(x => x.Course)
            .WithMany(x => x.CarryOverCourses)
            .HasForeignKey(x => x.CourseId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<CarryOverCourse>()
            .HasOne(x => x.OriginTerm)
            .WithMany()
            .HasForeignKey(x => x.OriginTermId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Exam>()
            .HasOne(x => x.CourseOffering)
            .WithMany(x => x.Exams)
            .HasForeignKey(x => x.CourseOfferingId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}

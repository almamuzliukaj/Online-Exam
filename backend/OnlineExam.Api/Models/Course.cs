using System.ComponentModel.DataAnnotations;

namespace OnlineExam.Api.Models;

public class Course
{
    public Guid Id { get; set; }

    [MaxLength(50)]
    public string Code { get; set; } = null!;

    [MaxLength(200)]
    public string Name { get; set; } = null!;

    public int Credits { get; set; }
    public int YearOfStudy { get; set; }
    public int DefaultSemesterNo { get; set; }
    public bool IsElective { get; set; }
    public bool IsActive { get; set; } = true;

    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;

    public ICollection<CourseOffering> CourseOfferings { get; set; } = new List<CourseOffering>();
    public ICollection<CarryOverCourse> CarryOverCourses { get; set; } = new List<CarryOverCourse>();
}

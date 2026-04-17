using System.ComponentModel.DataAnnotations;

namespace OnlineExam.Api.Models;

public class Term
{
    public Guid Id { get; set; }

    [MaxLength(50)]
    public string Code { get; set; } = null!;

    [MaxLength(100)]
    public string Name { get; set; } = null!;

    [MaxLength(20)]
    public string Season { get; set; } = null!;

    [MaxLength(20)]
    public string AcademicYearLabel { get; set; } = null!;

    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public DateTime EnrollmentOpenAt { get; set; }
    public DateTime EnrollmentCloseAt { get; set; }

    [MaxLength(20)]
    public string Status { get; set; } = "Draft";

    public bool IsCurrent { get; set; }

    public ICollection<CourseOffering> CourseOfferings { get; set; } = new List<CourseOffering>();
    public ICollection<SemesterEnrollment> SemesterEnrollments { get; set; } = new List<SemesterEnrollment>();
}

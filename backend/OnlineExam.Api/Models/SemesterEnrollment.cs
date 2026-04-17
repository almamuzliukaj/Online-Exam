using System.ComponentModel.DataAnnotations;

namespace OnlineExam.Api.Models;

public class SemesterEnrollment
{
    public Guid Id { get; set; }
    public Guid StudentId { get; set; }
    public Guid TermId { get; set; }
    public Term? Term { get; set; }
    public int YearOfStudy { get; set; }
    public int SemesterNo { get; set; }

    [MaxLength(20)]
    public string Status { get; set; } = "Pending";

    public DateTime EnrolledAt { get; set; }
    public Guid? ApprovedBy { get; set; }

    [MaxLength(1000)]
    public string Notes { get; set; } = string.Empty;

    public ICollection<StudentCourseEnrollment> StudentCourseEnrollments { get; set; } = new List<StudentCourseEnrollment>();
}

using System.ComponentModel.DataAnnotations;

namespace OnlineExam.Api.Models;

public class StudentCourseEnrollment
{
    public Guid Id { get; set; }
    public Guid StudentId { get; set; }
    public Guid CourseOfferingId { get; set; }
    public CourseOffering? CourseOffering { get; set; }
    public Guid? LinkedSemesterEnrollmentId { get; set; }
    public SemesterEnrollment? LinkedSemesterEnrollment { get; set; }

    [MaxLength(30)]
    public string EnrollmentSource { get; set; } = "RegularSemester";

    [MaxLength(20)]
    public string Status { get; set; } = "Eligible";

    public bool EligibleForExam { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public Guid CreatedBy { get; set; }
}

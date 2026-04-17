namespace OnlineExam.Api.DTOs;

public class CreateStudentCourseEnrollmentDto
{
    public Guid CourseOfferingId { get; set; }
    public Guid? LinkedSemesterEnrollmentId { get; set; }
    public string EnrollmentSource { get; set; } = "ManualOverride";
    public string Status { get; set; } = "Eligible";
    public bool EligibleForExam { get; set; } = true;
}

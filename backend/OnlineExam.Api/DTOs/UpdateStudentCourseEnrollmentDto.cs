namespace OnlineExam.Api.DTOs;

public class UpdateStudentCourseEnrollmentDto
{
    public string Status { get; set; } = "Eligible";
    public bool EligibleForExam { get; set; } = true;
}

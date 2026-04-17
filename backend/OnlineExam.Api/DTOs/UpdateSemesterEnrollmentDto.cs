namespace OnlineExam.Api.DTOs;

public class UpdateSemesterEnrollmentDto
{
    public int YearOfStudy { get; set; }
    public int SemesterNo { get; set; }
    public string Status { get; set; } = "Pending";
    public string Notes { get; set; } = string.Empty;
}

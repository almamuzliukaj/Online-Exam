namespace OnlineExam.Api.DTOs;

public class CreateSemesterEnrollmentDto
{
    public Guid TermId { get; set; }
    public int YearOfStudy { get; set; }
    public int SemesterNo { get; set; }
    public string Status { get; set; } = "Pending";
    public string Notes { get; set; } = string.Empty;
}

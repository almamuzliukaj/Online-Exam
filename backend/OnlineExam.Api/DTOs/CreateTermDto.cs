namespace OnlineExam.Api.DTOs;

public class CreateTermDto
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Season { get; set; } = string.Empty;
    public string AcademicYearLabel { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public DateTime EnrollmentOpenAt { get; set; }
    public DateTime EnrollmentCloseAt { get; set; }
    public bool IsCurrent { get; set; }
}

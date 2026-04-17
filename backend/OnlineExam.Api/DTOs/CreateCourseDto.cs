namespace OnlineExam.Api.DTOs;

public class CreateCourseDto
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public int Credits { get; set; }
    public int YearOfStudy { get; set; }
    public int DefaultSemesterNo { get; set; }
    public bool IsElective { get; set; }
    public string Description { get; set; } = string.Empty;
}

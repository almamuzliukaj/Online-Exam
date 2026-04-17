namespace OnlineExam.Api.DTOs;

public class CreateCarryOverCourseDto
{
    public Guid CourseId { get; set; }
    public Guid OriginTermId { get; set; }
    public int OriginSemesterNo { get; set; }
    public string Reason { get; set; } = string.Empty;
}

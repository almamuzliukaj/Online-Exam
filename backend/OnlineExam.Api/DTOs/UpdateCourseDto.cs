namespace OnlineExam.Api.DTOs;

public class UpdateCourseDto : CreateCourseDto
{
    public bool IsActive { get; set; } = true;
}

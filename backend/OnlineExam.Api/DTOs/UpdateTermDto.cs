namespace OnlineExam.Api.DTOs;

public class UpdateTermDto : CreateTermDto
{
    public string Status { get; set; } = "Draft";
}

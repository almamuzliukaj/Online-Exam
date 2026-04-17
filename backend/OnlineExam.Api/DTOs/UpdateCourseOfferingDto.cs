namespace OnlineExam.Api.DTOs;

public class UpdateCourseOfferingDto
{
    public int YearOfStudy { get; set; }
    public int SemesterNo { get; set; }
    public string SectionCode { get; set; } = "A";
    public string DeliveryType { get; set; } = "Regular";
    public int Capacity { get; set; }
    public string Status { get; set; } = "Draft";
    public Guid PrimaryProfessorId { get; set; }
    public Guid? AssistantId { get; set; }
}

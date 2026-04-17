namespace OnlineExam.Api.DTOs;

public class CreateCourseOfferingDto
{
    public Guid CourseId { get; set; }
    public Guid TermId { get; set; }
    public int YearOfStudy { get; set; }
    public int SemesterNo { get; set; }
    public string SectionCode { get; set; } = "A";
    public string DeliveryType { get; set; } = "Regular";
    public int Capacity { get; set; }
    public Guid PrimaryProfessorId { get; set; }
    public Guid? ProfessorId { get; set; }
    public Guid? AssistantId { get; set; }
}

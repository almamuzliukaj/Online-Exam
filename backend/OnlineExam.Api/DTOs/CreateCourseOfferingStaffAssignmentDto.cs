namespace OnlineExam.Api.DTOs;

public class CreateCourseOfferingStaffAssignmentDto
{
    public Guid UserId { get; set; }
    public string RoleInOffering { get; set; } = string.Empty;
    public string AssignmentType { get; set; } = "Secondary";
    public string PermissionsProfile { get; set; } = "LimitedTeaching";
}

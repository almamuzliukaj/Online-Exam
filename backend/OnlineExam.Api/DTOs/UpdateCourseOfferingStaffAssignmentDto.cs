namespace OnlineExam.Api.DTOs;

public class UpdateCourseOfferingStaffAssignmentDto
{
    public string AssignmentType { get; set; } = "Secondary";
    public string PermissionsProfile { get; set; } = "LimitedTeaching";
    public bool IsActive { get; set; } = true;
}

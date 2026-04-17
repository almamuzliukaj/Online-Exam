using System.ComponentModel.DataAnnotations;

namespace OnlineExam.Api.Models;

public class CourseOfferingStaffAssignment
{
    public Guid Id { get; set; }
    public Guid CourseOfferingId { get; set; }
    public CourseOffering? CourseOffering { get; set; }
    public Guid UserId { get; set; }

    [MaxLength(20)]
    public string RoleInOffering { get; set; } = null!;

    [MaxLength(20)]
    public string AssignmentType { get; set; } = "Secondary";

    [MaxLength(30)]
    public string PermissionsProfile { get; set; } = "LimitedTeaching";

    public DateTime AssignedAt { get; set; }
    public Guid AssignedBy { get; set; }
    public DateTime? RevokedAt { get; set; }
    public Guid? RevokedBy { get; set; }
    public bool IsActive { get; set; } = true;
}

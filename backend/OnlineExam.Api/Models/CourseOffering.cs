using System.ComponentModel.DataAnnotations;

namespace OnlineExam.Api.Models;

public class CourseOffering
{
    public Guid Id { get; set; }

    public Guid CourseId { get; set; }
    public Course? Course { get; set; }

    public Guid TermId { get; set; }
    public Term? Term { get; set; }

    public int YearOfStudy { get; set; }
    public int SemesterNo { get; set; }

    [MaxLength(50)]
    public string SectionCode { get; set; } = "A";

    [MaxLength(20)]
    public string DeliveryType { get; set; } = "Regular";

    public int Capacity { get; set; }

    [MaxLength(20)]
    public string Status { get; set; } = "Draft";

    public Guid PrimaryProfessorId { get; set; }
    public Guid? AssistantId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public ICollection<CourseOfferingStaffAssignment> StaffAssignments { get; set; } = new List<CourseOfferingStaffAssignment>();
    public ICollection<StudentCourseEnrollment> StudentCourseEnrollments { get; set; } = new List<StudentCourseEnrollment>();
    public ICollection<Exam> Exams { get; set; } = new List<Exam>();
}

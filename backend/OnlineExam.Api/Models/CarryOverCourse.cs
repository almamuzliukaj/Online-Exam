using System.ComponentModel.DataAnnotations;

namespace OnlineExam.Api.Models;

public class CarryOverCourse
{
    public Guid Id { get; set; }
    public Guid StudentId { get; set; }
    public Guid CourseId { get; set; }
    public Course? Course { get; set; }
    public Guid OriginTermId { get; set; }
    public Term? OriginTerm { get; set; }
    public int OriginSemesterNo { get; set; }

    [MaxLength(20)]
    public string Reason { get; set; } = null!;

    public Guid? SourceResultId { get; set; }

    [MaxLength(20)]
    public string Status { get; set; } = "Open";

    public Guid? ResolvedByPassingOfferingId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? ClosedAt { get; set; }
}

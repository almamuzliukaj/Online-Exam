using System;

namespace OnlineExam.Api.Models
{
    public class CourseOffering
    {
        public Guid Id { get; set; }
        public Guid CourseId { get; set; }
        public Course? Course { get; set; }    // Opsionale për të parandaluar validation error
        public Guid TermId { get; set; }
        public Term? Term { get; set; }        // Opsionale për të parandaluar validation error
        public int YearOfStudy { get; set; }
        public int SemesterNo { get; set; }
        public Guid ProfessorId { get; set; }
        public Guid? AssistantId { get; set; }
    }
}
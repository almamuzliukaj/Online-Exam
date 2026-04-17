using System;

namespace OnlineExam.Api.DTOs
{
    public class CreateCourseOfferingDto
    {
        public Guid CourseId { get; set; }
        public Guid TermId { get; set; }
        public int YearOfStudy { get; set; }
        public int SemesterNo { get; set; }
        public Guid ProfessorId { get; set; }
        public Guid? AssistantId { get; set; }
    }
}
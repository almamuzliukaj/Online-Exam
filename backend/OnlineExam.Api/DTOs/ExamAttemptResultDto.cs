using System;
using System.Collections.Generic;

namespace OnlineExam.Api.DTOs
{
    public class ExamAttemptResultDto
    {
        public Guid ExamAttemptId { get; set; }
        public double Score { get; set; }
        public List<QuestionScoreDetailDto> Questions { get; set; } = new();
    }

    public class QuestionScoreDetailDto
    {
        public Guid QuestionId { get; set; }
        public double PointsAwarded { get; set; }
        public double MaxPoints { get; set; }
    }
}

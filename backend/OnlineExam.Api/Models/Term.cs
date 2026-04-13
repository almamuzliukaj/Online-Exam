using System;

namespace OnlineExam.Api.Models
{
    public class Term
    {
        public Guid Id { get; set; }
        public string Season { get; set; } = null!; // "Winter" ose "Summer"
        public int Year { get; set; }
    }
}
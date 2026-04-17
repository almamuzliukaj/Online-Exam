namespace OnlineExam.Api.DTOs
{
    public class UpdateUserDto
    {
        public string FullName { get; set; } = null!;
        public string Role { get; set; } = null!;
        public bool IsActive { get; set; }
    }
}

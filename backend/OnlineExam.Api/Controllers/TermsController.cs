using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OnlineExam.Api.Models;
using OnlineExam.Api.Data;

namespace OnlineExam.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class TermsController : ControllerBase
    {
        private readonly AppDbContext _context;
        public TermsController(AppDbContext context) => _context = context;

        [HttpGet]
        public IActionResult GetTerms() => Ok(_context.Terms.ToList());

        [HttpPost]
        public IActionResult CreateTerm([FromBody] Term term)
        {
            term.Id = Guid.NewGuid();
            _context.Terms.Add(term);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetTerms), new { id = term.Id }, term);
        }
    }
}
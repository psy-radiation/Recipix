using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Recipix.Server.Data;
using Recipix.Server.Models;
using System.Security.Claims;

[Route("api/[controller]")]
[ApiController]
public class CommentsController : ControllerBase
{
    private readonly AppDbContext _context;

    public CommentsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("recipe/{recipeId}")]
    public async Task<IActionResult> GetCommentsForRecipe(int recipeId)
    {
        var comments = await _context.Comments
            .Where(c => c.RecipeId == recipeId)
            .Include(c => c.User)
            .OrderByDescending(c => c.CreatedAt)
            .Select(c => new
            {
                c.Id,
                c.Text,
                c.CreatedAt,
                AuthorUsername = c.User.Username,
                AuthorAvatar = $"/avatars/{c.User.AvatarFileName}"
            })
            .ToListAsync();

        return Ok(comments);
    }


    [HttpPost]
    [Authorize]
    public async Task<IActionResult> AddComment([FromBody] CommentDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var comment = new Comment
        {
            Text = dto.Text,
            RecipeId = dto.RecipeId,
            UserId = int.Parse(userId),
            CreatedAt = DateTime.UtcNow
        };

        _context.Comments.Add(comment);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Комментарий добавлен" });
    }
}

public class CommentDto
{
    public int RecipeId { get; set; }
    public string Text { get; set; }
}
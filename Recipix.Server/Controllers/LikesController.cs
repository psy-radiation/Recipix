using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Recipix.Server.Data;
using Recipix.Server.Models;
using Microsoft.EntityFrameworkCore;    
using System.Security.Claims;

namespace Recipix.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class LikesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LikesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("{recipeId}")]
        public async Task<IActionResult> ToggleLike(int recipeId)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var existingLike = await _context.RecipeLikes
                .FirstOrDefaultAsync(l => l.UserId == userId && l.RecipeId == recipeId);

            if (existingLike != null)
            {
                _context.RecipeLikes.Remove(existingLike);
                await _context.SaveChangesAsync();
                return Ok(new { liked = false });
            }

            var like = new RecipeLike
            {
                UserId = userId,
                RecipeId = recipeId
            };

            _context.RecipeLikes.Add(like);
            await _context.SaveChangesAsync();

            return Ok(new { liked = true });
        }

        [HttpGet("mine")]
        public async Task<IActionResult> GetMyLikedRecipes()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var recipes = await _context.RecipeLikes
                .Where(l => l.UserId == userId)
                .Select(l => new
                {
                    l.Recipe.Id,
                    l.Recipe.Title,
                    ImageUrl = $"/recipe-images/{l.Recipe.ImageFileName}",
                    l.Recipe.Difficulty,
                    TimeMinutes = l.Recipe.CookingTimeMinutes
                })
                .ToListAsync();

            return Ok(recipes);
        }

        [HttpGet("check/{recipeId}")]
        public async Task<IActionResult> IsLiked(int recipeId)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var isLiked = await _context.RecipeLikes
                .AnyAsync(l => l.UserId == userId && l.RecipeId == recipeId);

            return Ok(new { liked = isLiked });
        }
        [HttpGet("count/{recipeId}")]
        public async Task<IActionResult> LikeCount(int recipeId)
        {
            var count = await _context.RecipeLikes.CountAsync(l => l.RecipeId == recipeId);
            return Ok(count);
        }
    }
}
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Recipix.Server.Data;

namespace Recipix.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecipesHomeСontroller : ControllerBase
    {
        private readonly AppDbContext _context;

        public RecipesHomeСontroller(AppDbContext context)
        {
            _context = context;
        }


        [HttpGet]
        public IActionResult Get() {
            var recipes = _context.Recipes
        .OrderByDescending(r => r.Id) // предполагаем, что Id - автоинкремент
        .Take(20)
        .Select(r => new
        {
            Id = r.Id,
            Title = r.Title,
            ImageUrl = $"/recipe-images/{r.ImageFileName}",
            Difficulty = r.Difficulty,
            TimeMinutes = r.CookingTimeMinutes
        })
        .ToList();

            return Ok(recipes);
        }
    }
}

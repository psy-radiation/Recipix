using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Recipix.Server.Data;
using Recipix.Server.Models;
using System.Security.Claims;

namespace Recipix.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecipesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public RecipesController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateRecipe()
        {
            var form = await Request.ReadFormAsync();
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdStr, out var userId))
                return Unauthorized("Пользователь не авторизован");
            var title = form["title"].ToString();
            var cookingTimeStr = form["cookingTimeMinutes"].ToString();
            var difficulty = form["difficulty"].ToString();
            var description = form["description"].ToString();
            var instructions = form["instructions"].ToString();
            var file = form.Files["image"];

            if (file == null || file.Length == 0)
                return BadRequest("Файл изображения отсутствует");

            var ext = Path.GetExtension(file.FileName);
            var fileName = Guid.NewGuid().ToString() + ext;
            var savePath = Path.Combine(_env.WebRootPath ?? "wwwroot", "recipe-images");

            if (!Directory.Exists(savePath))
                Directory.CreateDirectory(savePath);

            var filePath = Path.Combine(savePath, fileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var recipe = new Recipe
            {
                Title = title,
                CookingTimeMinutes = int.TryParse(cookingTimeStr, out int minutes) ? minutes : 0,
                Difficulty = difficulty,
                Description = description,
                Instructions = instructions,
                ImageFileName = fileName,
                UserId = userId
            };

            _context.Recipes.Add(recipe);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Рецепт успешно добавлен", recipe.Id });
        }

        [HttpGet]
        public IActionResult Get()
        {
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

        [HttpGet("{id}")]
        public async Task<IActionResult> GetRecipe(int id)
        {
            var recipe = await _context.Recipes
                .Include(r => r.Author)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (recipe == null)
                return NotFound();

            var result = new
            {
                id = recipe.Id,
                title = recipe.Title,
                imageUrl = $"/recipe-images/{recipe.ImageFileName}", // заменяем ImageFileName на imageUrl
                difficulty = recipe.Difficulty,
                timeMinutes = recipe.CookingTimeMinutes,
                description = recipe.Description,
                instruction = recipe.Instructions,
                author = recipe.Author?.Username ?? "Неизвестно",
                authorid = recipe.UserId,
                created = recipe.CreatedAt
            };

            return Ok(result);
        }
        [HttpGet("mine")]
        public IActionResult GetAllMy()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var recipes = _context.Recipes.Where(r => r.UserId==userId)
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
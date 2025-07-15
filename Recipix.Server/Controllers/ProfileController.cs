using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Recipix.Server.Data;
using System.Security.Claims;

namespace Recipix.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProfileController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _environment;

        public ProfileController(AppDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        [Authorize]
        [HttpPost("upload-avatar")]
        public async Task<IActionResult> UploadAvatar(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Файл не выбран");

            // Получаем ID пользователя из токена
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("Пользователь не авторизован");

            var user = await _context.Users.FindAsync(int.Parse(userId));
            if (user == null)
                return NotFound("Пользователь не найден");

            // Генерируем уникальное имя файла
            var ext = Path.GetExtension(file.FileName);
            var fileName = $"avatar_{user.Id}{ext}";
            var avatarPath = Path.Combine(_environment.WebRootPath, "avatars");

            if (!Directory.Exists(avatarPath))
                Directory.CreateDirectory(avatarPath);

            var fullPath = Path.Combine(avatarPath, fileName);

            // Сохраняем файл
            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Обновляем имя аватара у пользователя
            user.AvatarFileName = fileName;
            await _context.SaveChangesAsync();

            return Ok(new { fileName });
        }

        [Authorize]
        [HttpGet("me")]
        public IActionResult GetCurrentUser()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = _context.Users.FirstOrDefault(u => u.Id.ToString() == userId);

            if (user == null)
                return NotFound();

            return Ok(new
            {
                user.Id,
                user.Username,
                user.Email,
                AvatarUrl = $"/avatars/{user.AvatarFileName}"
            });
        }
    }
}

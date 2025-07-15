
using System.ComponentModel.DataAnnotations;

namespace Recipix.Server.Models
{
    public class Comment
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Text { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        public int UserId { get; set; }

        public User User { get; set; }

        [Required]
        public int RecipeId { get; set; }

        public Recipe Recipe { get; set; }
    }
}
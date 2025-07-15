using System.ComponentModel.DataAnnotations;

namespace Recipix.Server.Models
{
    public class Recipe
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Title { get; set; }

        [Required]
        public string ImageFileName { get; set; } 

        [Required]
        public int CookingTimeMinutes { get; set; } 

        [Required]
        public string Difficulty { get; set; } 

        [Required]
        public string Description { get; set; }  

        public string Instructions { get; set; }  

        public int UserId { get; set; }
        public User Author { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

}

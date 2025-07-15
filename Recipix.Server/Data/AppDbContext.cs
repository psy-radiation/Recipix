using Microsoft.EntityFrameworkCore;
using Recipix.Server.Models;

namespace Recipix.Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Recipe> Recipes { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<RecipeLike> RecipeLikes { get; set; }
    }
}
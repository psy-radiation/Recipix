﻿using System.ComponentModel.DataAnnotations;

namespace Recipix.Server.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Username { get; set; } = string.Empty;

        [Required]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;
        public string AvatarFileName { get; set; } = "defaultpfp.png";

    }
}
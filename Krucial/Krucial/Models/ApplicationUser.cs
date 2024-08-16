using Microsoft.AspNetCore.Identity;

namespace Krucial_API.Models;

public class ApplicationUser : IdentityUser
{
    public string Name { get; set; }
}

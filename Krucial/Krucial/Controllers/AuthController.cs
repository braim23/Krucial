using Krucial_API.Data;
using Krucial_API.Models;
using Krucial_API.Models.Dto;
using Krucial_API.Utility;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace Krucial_API.Controllers;

[Route("api/auth")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private ApiResponse _response;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private string secretKey;
    public AuthController(
        ApplicationDbContext db,
        IConfiguration configuration,
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole> roleManager)
    {
        _db = db;
        secretKey = configuration.GetValue<string>("Api:Settings");
        _response = new ApiResponse();
        _userManager = userManager;
        _roleManager = roleManager;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDTO loginRequestDTO)
    {
        ApplicationUser userFromDb = _db.ApplicationUsers
            .FirstOrDefault(u => u.UserName.ToLower() == loginRequestDTO.UserName.ToLower());

        bool isValid = await _userManager.CheckPasswordAsync(userFromDb, loginRequestDTO.Password);

        if (isValid == false)
        {
            _response.Result = new LoginResponseDTO();
            _response.StatusCode = HttpStatusCode.BadRequest;
            _response.IsSuccess = false;
            _response.ErrorMessages.Add("Username or password is incorrect.");
            return BadRequest();
        }

        // Generate JWT token

        LoginResponseDTO loginResponse = new()
        {
            Email = userFromDb.Email,
            Token = "test"
        };

        if (loginResponse.Email == null || string.IsNullOrEmpty(loginResponse.Token))
        {
            _response.StatusCode = HttpStatusCode.BadRequest;
            _response.IsSuccess = false;
            _response.ErrorMessages.Add("Username or password is incorrect.");
            return BadRequest(_response);
        }

        _response.StatusCode = HttpStatusCode.OK;
        _response.IsSuccess = true;
        _response.Result = loginResponse;
        return Ok(_response);

    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequestDTO registerRequestDTO)
    {
        ApplicationUser userFromDb = _db.ApplicationUsers
            .FirstOrDefault(u => u.UserName.ToLower() == registerRequestDTO.UserName.ToLower());

        if (userFromDb != null)
        {
            _response.StatusCode = HttpStatusCode.BadRequest;
            _response.IsSuccess = false;
            _response.ErrorMessages.Add("Username already exists");
            return BadRequest(_response);
        }

        ApplicationUser newUser = new()
        {
            UserName = registerRequestDTO.UserName,
            Email = registerRequestDTO.UserName,
            NormalizedEmail = registerRequestDTO.UserName,
            Name = registerRequestDTO.Name

        };
        try
        {
            var result = await _userManager.CreateAsync(newUser, registerRequestDTO.Password);
            if (result.Succeeded)
            {
                if (_roleManager.RoleExistsAsync(SD.Role_Admin).GetAwaiter().GetResult())
                {
                    await _roleManager.CreateAsync(new IdentityRole(SD.Role_Admin));
                    await _roleManager.CreateAsync(new IdentityRole(SD.Role_Customer));
                }
                if (registerRequestDTO.Role.ToLower() == SD.Role_Admin)
                {
                    await _userManager.AddToRoleAsync(newUser, SD.Role_Admin);
                }
                else
                {
                    await _userManager.AddToRoleAsync(newUser, SD.Role_Customer);
                }

                _response.StatusCode = HttpStatusCode.OK;
                _response.IsSuccess = true;
                return Ok(_response);
            }
        }
        catch (Exception)
        {

        }

        _response.StatusCode = HttpStatusCode.BadRequest;
        _response.IsSuccess = false;
        _response.ErrorMessages.Add("Error while registering");
        return BadRequest(_response);
    }


}

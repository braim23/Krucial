using Krucial_API.Data;
using Krucial_API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace Krucial_API.Controllers;

[Route("api/MenuItem")]
[ApiController]
public class MenuItemController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private ApiResponse _response;

    public MenuItemController(ApplicationDbContext db)
    {
        _db = db;
        _response = new ApiResponse();
    }
    [HttpGet]
    public async Task<IActionResult> GetMenuItems()
    {
        _response.Result = await _db.MenuItems.ToListAsync();
        _response.StatusCode = HttpStatusCode.OK;
        return Ok(_response);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetMenuItem(int id)
    {
        if(id == 0)
        {
            _response.StatusCode=HttpStatusCode.BadRequest;
            return BadRequest(_response);
        }
        MenuItem menuItem = await _db.MenuItems.FirstOrDefaultAsync(x => x.Id == id);
        if (menuItem == null)
        {
            _response.StatusCode = HttpStatusCode.BadRequest;
            return NotFound(_response);
        }
        _response.Result = menuItem;
        _response.StatusCode = HttpStatusCode.OK;
        return Ok(_response);
    }
}
